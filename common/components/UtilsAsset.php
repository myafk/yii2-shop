<?php

namespace common\components;

use yii\web\AssetBundle;

class UtilsAsset extends AssetBundle
{
	public $sourcePath = '@common/components/assets';
	public $js = [
		'utils.js',
	];
	public $depends = [
		'yii\web\JqueryAsset',
		'common\components\NotifyAsset',
	];
}
