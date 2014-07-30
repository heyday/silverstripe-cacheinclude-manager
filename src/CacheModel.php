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
            $caches[] = [
                'name' => $name,
                'keys' => $this->getKeys($name)
            ];
        }
        
        return $caches;
    }

    /**
     * @param $name
     * @return array
     */
    public function get($name)
    {
        $caches = [];

        foreach ($this->getKeys($name) as $key) {
            $caches[] = [
                'key' => $key,
                'value' => $this->cache->fetch($key)
            ];
        }

        return $caches;
    }

    /**
     * @param $name
     * @return bool|mixed|string
     */
    public function getKeys($name)
    {
        $this->assertHasName($name);

        $keys = [];

        foreach ((array) $this->cache->fetch($name) as $key => $value) {
            if ($value) {
                $keys[] = $key;
            }
        }
        
        return $keys;
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