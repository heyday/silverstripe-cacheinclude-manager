<?php

namespace Heyday\CacheInclude\Transformers;

use League\Fractal\TransformerAbstract;

class CacheTransformer extends TransformerAbstract
{
    public function transform(array $cache)
    {
        return $cache;
    }
}