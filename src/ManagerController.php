<?php

namespace Heyday\CacheInclude;

use Controller;
use Director;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use Permission;
use Security;
use SS_HTTPRequest;

class ManagerController extends Controller
{
    /**
     * @var \League\Fractal\Manager
     */
    protected $fractal;

    /**
     * @var \Heyday\CacheInclude\CacheModel
     */
    protected $cache;

    /**
     * @var array
     */
    private static $allowed_actions = [
        'cache'
    ];

    /**
     * The default access code for the controller
     * @var string
     */
    private static $access_code = 'ADMIN';

    /**
     * @param \League\Fractal\Manager $fractal
     * @param \Heyday\CacheInclude\CacheModel $model
     */
    public function __construct(Manager $fractal, CacheModel $model)
    {
        $this->fractal = $fractal;
        $this->model = $model;
    }

    /**
     * 
     */
    public function init()
    {
        parent::init();

        if (!$this->hasAccess()) {
            return Security::permissionFailure();
        }
    }

    /**
     * @return bool
     */
    protected function hasAccess()
    {
        return Director::is_cli() || Permission::check($this->config()->get('access_code'));
    }

    /**
     * @param \SS_HTTPRequest $request
     * @return \SS_HTTPResponse
     */
    public function cache(SS_HTTPRequest $request)
    {
        if ($request->isGET()) {
            return $this->cacheGET($request);
        } elseif ($request->isDELETE()) {
            return $this->cacheDELETE($request);
        } else {
            $this->response->setStatusCode(400);
            $this->response->setBody($this->resourceToJson($this->getSuccessResource(false)));
            return $this->response;
        }
    }

    /**
     * @param \SS_HTTPRequest $request
     * @return \SS_HTTPResponse
     */
    protected function cacheGET(SS_HTTPRequest $request)
    {
        if ($request->param('ID')) {
            try {
                $resource = new Collection(
                    $this->model->get($request->param('ID')),
                    new Transformers\CacheTransformer()
                );

                $this->response->setStatusCode(200);
                $this->response->addHeader('Content-Type', 'application/json');
                $this->response->setBody($this->resourceToJson($resource));
            } catch (\InvalidArgumentException $e) {
                $this->response->setStatusCode(400);
                $this->response->setBody($this->resourceToJson($this->getSuccessResource(false)));
            }
        } else {
            $resource = new Collection(
                $this->model->getAll(),
                new Transformers\CacheTransformer()
            );

            $this->response->setStatusCode(200);
            $this->response->addHeader('Content-Type', 'application/json');
            $this->response->setBody($this->resourceToJson($resource));
        }

        return $this->response;
    }

    /**
     * @param \SS_HTTPRequest $request
     * @return \SS_HTTPResponse
     */
    protected function cacheDELETE(SS_HTTPRequest $request)
    {
        if (!$request->param('ID')) {
            $this->response->setStatusCode(400);
            return $this->response;
        }
        
        try {
            $this->model->delete($request->param('ID'));
            $this->response->addHeader('Content-Type', 'application/json');
            $this->response->setBody($this->resourceToJson($this->getSuccessResource(true)));
        } catch (\InvalidArgumentException $e) {
            $this->response->setStatusCode(400);
            $this->response->setBody($this->resourceToJson($this->getSuccessResource(false)));
        }
        
        return $this->response;
    }

    /**
     * @param \League\Fractal\Resource\ResourceAbstract $resource
     * @return string
     */
    protected function resourceToJson($resource)
    {
        return $this->fractal->createData($resource)->toJson();
    }

    /**
     * @param $value
     * @return \League\Fractal\Resource\Item
     */
    protected function getSuccessResource($value)
    {
        return new Item($value, new Transformers\SuccessTransformer());
    }
}