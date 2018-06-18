<?php

namespace common\components;

class ActiveRecord extends \yii\db\ActiveRecord
{

	public function attributeLabels()
	{
		$labels = [];
		foreach ($this->attributes as $key => $attribute) {
			$labels[$key] = \Yii::t('app', $key);
		}
		return $labels;
	}

}