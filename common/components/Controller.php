<?php

namespace common\components;

use Yii;
use yii\base\Model;
use yii\helpers\Html;
use yii\web\Response;

class Controller extends \yii\web\Controller
{

	/**
	 * @param $model Model|Model[]
	 * @return array|null
	 */
	public function modelErrorsAsJson($model) {
		if (Yii::$app->request->isAjax) {
			Yii::$app->response->format = Response::FORMAT_JSON;
			if (!is_array($model))
				$models[] = $model;
			else
				$models = $model;
			foreach($models as $item) {
				/* @var Model $item */
				if (!$item->validate(null, false)) {
					foreach ($item->getErrors() as $attribute => $errors) {
						$result[Html::getInputId($item, $attribute)] = $errors;
					}
					return ['formErrors' => $result];
				}
			}
		}
		else
			return null;
	}

	/**
	 * @param $form FormModel
	 * @return array|null
	 */
	public function formErrorsAsJson($form) {
		if (Yii::$app->request->isAjax) {
			Yii::$app->response->format = Response::FORMAT_JSON;
			$models = [$form, $form->model];
			foreach($models as $item) {
				/* @var Model $item */
				if (!$item->validate(null, false)) {
					foreach ($item->getErrors() as $attribute => $errors) {
						$result[Html::getInputId($form, $attribute)] = $errors;
					}
					return ['formErrors' => $result];
				}
			}
		}
		else
			return null;
	}

}