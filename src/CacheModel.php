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
     * @param \Doctrine\Common\Cache\CacheProvider $cache
     * @param \Heyday\CacheInclude\Configs\ConfigInterface $config
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

        foreach ($this->config as $name => $config) {
            $caches[] = [
                'name' => $name,
                'keys' => $this->getKeys($name),
                'config' => $config
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

        foreach ($this->getKeys($name) as $key => $information) {
            $caches[] = $this->getByKey($name, $key);
        }

        return $caches;
    }

    /**
     * @param $name
     * @param $key
     * @return array
     */
    public function getByKey($name, $key)
    {
        $this->assertHasName($name);
        $this->assertHasKey($key);

        return [
            'key' => $key,
            'value' => $this->cache->fetch($key)
        ];
    }

    /**
     * @param $name
     * @return bool|mixed|string
     */
    public function getKeys($name)
    {
        $this->assertHasName($name);

        return (array) $this->cache->fetch($name);
    }

    public function delete($name)
    {
        $cacheInclude = new CacheInclude($this->cache,$this->config);
        $this->assertHasName($name);
        $limit = 20;
        while ($cacheInclude->checkLockForName($name)){
          sleep(1);
          $limit--;
          if($limit <= 0){
            break;
          }
        }
        if(!($limit <=  0)){
          $cacheInclude->createLockForName($name);
          $keys = (array) $this->cache->fetch($name);
          foreach (array_keys($keys) as $key) {
            $this->cache->delete($key);
          }
          $this->cache->save($name, []);
          $cacheInclude->releaseLockForName($name);
        }
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

    /**
     * @param $key
     * @throw \InvalidArgumentException
     */
    protected function assertHasKey($key)
    {
        if (null === $this->cache->fetch($key)) {
            throw new \InvalidArgumentException(sprintf(
                "The cache key '%s' doesn't exist",
                $key
            ));
        }
    }
}
