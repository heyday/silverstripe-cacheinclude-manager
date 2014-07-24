<?php

namespace Heyday\CacheInclude;

use Doctrine\Common\Cache\CacheProvider;
use Heyday\CacheInclude\Configs\ConfigInterface;

/**
 * @package Heyday\CacheInclude
 */
class CacheModel
{
    /**
     * @param CacheProvider $cache
     * @param ConfigInterface $config
     */
    public function __construct(
        CacheProvider $cache,
        ConfigInterface $config
    )
    {
        $this->cache = $cache;
        $this->config = $config;
    }

    /**
     * @return array
     */
    public function getAll()
    {
        $caches = [];

        foreach ($this->config as $name => $_) {
            $caches[$name] = $this->get($name);
        }
        
        return $caches;
    }

    /**
     * @param $name
     * @return array
     */
    public function get($name)
    {
        $this->assertHasName($name);

        $caches = [];
        $keys = (array) $this->cache->fetch($name);
        
        foreach ($keys as $key) {
            $caches[] = [
                'key' => $key,
                'value' => $this->cache->fetch($key)
            ];
        }

        return $caches;
    }
    
    public function delete($name)
    {
        $this->assertHasName($name);

        $keys = (array) $this->cache->fetch($name);
        foreach (array_keys($keys) as $key) {
            $this->cache->delete($key);
        }
        $this->cache->save($name, []);
    }

    /**
     * @param $name
     * @throw \InvalidArgumentException
     */
    protected function assertHasName($name)
    {
        if (!isset($this->config[$name])) {
            throw new \InvalidArgumentException(sprintf(
                "The cache name '%s' doesn't exist in the config",
                $name
            ));
        }
    }
}