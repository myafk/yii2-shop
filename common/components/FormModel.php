<?php

namespace common\components;

use yii\base\Model;
use yii\widgets\ActiveForm;

/**
 * Class ModelForm
 * @package common\components
 *
 * @property ActiveRecord $model
 * @property bool $isNewRecord
 */

class FormModel extends Model
{

	/* @var \common\components\ActiveRecord $_model */
	protected $_model;
	protected $_isNewRecord;

	/**
	 * @return ActiveRecord
	 */
	public function getModel()
	{
		return $this->_model;
	}

	/**
	 * @param $value ActiveRecord
	 */
	public function setModel($value)
	{
		$this->loadModel($value);
	}

	/**
	 * @return bool
	 */
	public function getIsNewRecord()
	{
		return $this->model->isNewRecord;
	}

	/**
	 * @param ActiveRecord $model
	 */
	public function loadModel($model)
	{
		$this->_model = $model;
		if ($model && !$model->isNewRecord)
			$this->setAttributes($model->attributes, false);
	}

	/**
	 * @param ActiveRecord $model
	 */
	public function copyModel($model)
	{
		$this->_model = $model;
		if ($model)
			$this->setAttributes($model->attributes, false);
	}

	/**
	 * @return bool
	 */
	public function prepare()
	{
		if ($this->validate()) {
			$this->model->setAttributes($this->attributes, false);
			if (!$this->model->validate()) {
				return false;
			}
			else {
				return true;
			}
		}
		else {
			return false;
		}
	}

	/**
	 * @return bool
	 */
	public function save()
	{
		if ($this->prepare())
			return $this->model->save();
	}

	/**
	 * @param array $attributeLabels
	 * @return array
	 */
	public function attributeLabels($attributeLabels = [])
	{
		if ($this->model)
			return array_merge($this->model->attributeLabels(), $attributeLabels);
		else
			return $attributeLabels;
	}

}