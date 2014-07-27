<?php

namespace Heyday\CacheInclude;

use LeftAndMain;
use ReactJS\React;

class ManagerAdmin extends LeftAndMain
{
    private static $url_segment = 'cache';

    /**
     * @var \ReactJS\React
     */
    protected $react;

    /**
     * @var \Heyday\CacheInclude\CacheModel
     */
    protected $model;

    /**
     * @param \Heyday\CacheInclude\CacheModel $model
     * @param \ReactJS\React $react
     */
    public function __construct(CacheModel $model, React $react)
    {
        $this->model = $model;
        $this->react = $react;
    }

    /**
     * @return string
     */
    public function RenderView()
    {
        return $this->react->renderAutoMountingComponent(
            './CacheView',
            $this->model->getAll(),
            'cacheinclude-cacheview'
        );
    }
}