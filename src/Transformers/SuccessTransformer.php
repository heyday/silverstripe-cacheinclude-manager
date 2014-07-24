<?php

namespace Heyday\CacheInclude\Transformers;

use League\Fractal\TransformerAbstract;

class SuccessTransformer extends TransformerAbstract
{
    public function transform($item)
    {
        return [
            'success' => (bool) $item
        ];
    }
}