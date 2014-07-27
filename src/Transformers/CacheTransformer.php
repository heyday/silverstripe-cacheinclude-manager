<?php

namespace Heyday\CacheInclude\Transformers;

use League\Fractal\TransformerAbstract;

class CacheTransformer extends TransformerAbstract
{
    public function transform(array $cache)
    {
        $item = [];
        
        if (isset($cache['key'])) {
            $item['key'] = urlencode($cache['key']);
        }
        
        if (isset($cache['value'])) {
            if ($cache['value'] instanceof \SS_HTTPResponse) {
                $item['value'] = $cache['value']->getBody();
            } else {
                $item['value'] = $cache['value'];
            }
        }
        
        return $item;
    }
}