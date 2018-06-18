<?php

use yii\db\Migration;

/**
 * Class m180413_043753_create_user
 */
class m180413_043753_create_user extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
	    $this->createTable('{{%user}}', [
		    'id' => $this->primaryKey(),
		    'username' => $this->string()->notNull()->unique(),
		    'auth_key' => $this->string(32)->notNull(),
		    'password_hash' => $this->string()->notNull(),
		    'password_reset_token' => $this->string()->unique(),
		    'status' => $this->smallInteger()->notNull()->defaultValue(120),
		    'created_at' => $this->integer()->notNull(),
		    'updated_at' => $this->integer()->notNull(),
	    ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
	    $this->dropTable('{{%user}}');
    }

}
