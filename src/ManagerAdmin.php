<?php

namespace Heyday\CacheInclude;

use LeftAndMain;

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