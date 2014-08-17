<?php

namespace Heyday\CacheInclude;

use Controller;
use Director;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use Permission;
use ReactJS\React;
use Security;
use SS_HTTPRequest;
use SSViewer;

class ManagerController extends Controller
{
    /**
     * @var \League\Fractal\Manager
     */
    protected $fractal;

    /**
     * @var \Heyday\CacheInclude\CacheModel
     */
    protected $cacheModel;

    /**
     * @var \ReactJS\React
     */
    protected $react;

    /**
     * @param \League\Fractal\Manager $fractal
     * @param \Heyday\CacheInclude\CacheModel $cacheModel
     * @param \ReactJS\React $react
     */
    public function __construct(Manager $fractal, CacheModel $cacheModel, React $react)
    {
        $this->fractal = $fractal;
        $this->cacheModel = $cacheModel;
        $this->react = $react;
        parent::__construct();
    }

    /**
     * @param $action
     * @return \SSViewer
     */
    public function getViewer($action)
    {
        return new SSViewer('ManagerController');
    }

    /**
     * @return string
     */
    public function ManagerComponent()
    {
        return $this->react->renderAutoMountingComponent(
            './source/js/Manager',
            [
                'initialCaches' => $this->resourceToArray(new Collection(
                    $this->cacheModel->getAll(),
                    new Transformers\CacheTransformer()
                ))['data']
            ]
        );
    }


    /**
     * Check the permissions
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
        return Director::is_cli() || Permission::check('ADMIN') || Director::isDev();
    }

    /**
     * @param SS_HTTPRequest $request
     * @return string
     */
    public function index(SS_HTTPRequest $request)
    {
        return $this->render();
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
        $statusCode = 200;
        $name = $request->param('ID');
        $key = $request->param('OtherID');
        $cacheTransformer = new Transformers\CacheTransformer();
        
        $this->response->addHeader('Content-Type', 'application/json');

        if ($name) {
            try {
                if ($key) {
                    $resource = new Item(
                        $this->cacheModel->getByKey($name, $key),
                        $cacheTransformer
                    );
                } else {
                    $resource = new Collection(
                        $this->cacheModel->get($name),
                        $cacheTransformer
                    );
                }
            } catch (\InvalidArgumentException $e) {
                $statusCode = 400;
                $resource = $this->getSuccessResource(false);
            }
        } else {
            $resource = new Collection(
                $this->cacheModel->getAll(),
                $cacheTransformer
            );
        }

        $this->response->setStatusCode($statusCode);
        $this->response->setBody($this->resourceToJson($resource));
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
            $this->response->setBody($this->resourceToJson($this->getSuccessResource(false)));
            return $this->response;
        }

        try {
            $this->cacheModel->delete($request->param('ID'));
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
     * @param \League\Fractal\Resource\ResourceAbstract $resource
     * @return array
     */
    protected function resourceToArray($resource)
    {
        return $this->fractal->createData($resource)->toArray();
    }

    /**
     * @param $value
     * @return \League\Fractal\Resource\Item
     */
    protected function getSuccessResource($value)
    {
        return new Item($value, new Transformers\SuccessTransformer());
    }

    /**
     * Template helper method to check if live
     * @return bool
     */
    public function isLive()
    {
        return Director::isLive();
    }
}
