<?php

namespace common\components;

use yii\web\AssetBundle;

class NotifyAsset extends AssetBundle
{
	public $sourcePath = '@bower/remarkable-bootstrap-notify/dist';
	public $js = [
		'bootstrap-notify.js',
	];
	public $depends = [
		'yii\bootstrap\BootstrapPluginAsset',
	];
}
