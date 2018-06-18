<?php

namespace common\components;

class ActiveForm extends \yii\widgets\ActiveForm
{

	public $enableAjaxSubmit = true;
	public $enableClientValidation = true;

	public function run()
	{
		parent::run();
		$this->initAjaxValidation();
	}

	public function initAjaxValidation()
	{
		if ($this->enableAjaxSubmit) {
			$id = $this->options['id'];
			$view = $this->getView();
			ActiveFormAsset::register($view);
			$view->registerJs("jQuery('#$id').activeFormAjaxSubmit();");
		}
	}

}