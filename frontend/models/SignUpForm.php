<?php
namespace frontend\models;

use common\components\FormModel;
use common\models\User;

/**
 * SignUp form
 *
 * @property User $model
 */
class SignUpForm extends FormModel
{
    public $username;
    public $password;


    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['username', 'password'], 'required'],
	        [['username', 'password'], 'trim'],

	        ['username', 'string', 'max' => 255],
	        ['username', 'email'],
            ['username', 'unique', 'targetClass' => '\common\models\User', 'message' => 'This username has already been taken.'],

            ['password', 'required'],
            ['password', 'string', 'min' => 6],
        ];
    }

	/**
	 * @return User
	 */
	public function getModel()
	{
		if ($this->_model === null)
			$this->_model = new User();
		return $this->_model;
	}

    public function save()
    {
	    if ($this->prepare()) {
		    $this->model->setPassword($this->password);
		    $this->model->generateAuthKey();
		    return $this->model->save();
	    }
	    return false;
    }
}
