<?php

namespace Heyday\CacheInclude\Transformers;

use League\Fractal\TransformerAbstract;

class CacheTransformer extends TransformerAbstract
{
    public function transform(array $cache)
    {
        $item  = [];
        
        $config = $cache['config'];

        $item['name'] = $cache['name'];
        $item['keys'] = $cache['keys'];

        $item['config'] = [];

        if (isset($config['context'])) {
            $item['config']['context'] = $config['context'];
        } else {
            $item['config']['context'] = 'no';
        }

        if (isset($config['contains'])) {
            $item['config']['contains'] = is_array($config['contains']) ? join(', ', $config['contains']) : $config['contains'];
        } else {
            $item['config']['contains'] = 'no';
        }
        
        if (isset($config['member']) && $config['member']) {
            $item['config']['member'] = 'yes';
        } else {
            $item['config']['member'] = 'no';
        }

        if (isset($config['expires'])) {
            $item['config']['expires'] = $config['expires'];
        } else {
            $item['config']['expires'] = 'no';
        }

        if (isset($config['versions'])) {
            $item['config']['versions'] = $config['versions'];
        } else {
            $item['config']['versions'] = 'no';
        }
        
        return $item;
    }
}