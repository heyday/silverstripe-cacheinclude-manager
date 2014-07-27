<?php

use ReactJS\React;
use Heyday\CacheInclude\CacheModel;

class CacheManagerAdmin extends LeftAndMain
{
    private static $url_segment = 'cache';
    private static $menu_title = 'Cache Manager';

    /**
     * @var \ReactJS\React
     */
    protected $react;

    /**
     * @var \Heyday\CacheInclude\CacheModel
     */
    protected $cacheModel;

    /**
     * @param \Heyday\CacheInclude\CacheModel $cacheModel
     * @param \ReactJS\React $react
     */
    public function __construct(CacheModel $cacheModel, React $react)
    {
        $this->cacheModel = $cacheModel;
        $this->react = $react;
        parent::__construct();
    }

    /**
     * @return string
     */
    public function RenderView()
    {
        return $this->react->renderAutoMountingComponent(
            './source/js/Manager',
            [
                'keys' => $this->cacheModel->getAll()
            ],
            'cacheinclude-cacheview'
        );
    }
}