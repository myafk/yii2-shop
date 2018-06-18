<?php

namespace common\components;

use yii\web\AssetBundle;

class ActiveFormAsset extends AssetBundle
{
	public $sourcePath = '@common/components/assets';
	public $js = [
		'activeForm.js',
	];
	public $depends = [
		'yii\widgets\ActiveFormAsset',
	];
}
