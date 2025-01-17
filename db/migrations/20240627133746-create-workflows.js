'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const DataTypes = Sequelize.DataTypes;
    await queryInterface.createTable('workflows', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        validate:{
          isUUID: 4
        }
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      category: {
        allowNull: true,
        type: DataTypes.STRING //one of Core processes, Support processes, Long-tail processes, Strategic processes, Management processes
      },
      tags: {
        allowNull: true,
        type: DataTypes.JSON, //array of tags
        defaultValue: [],
      },
      user_id: {
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        type: DataTypes.STRING(36)
      },
      workflow: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      image: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      prompt: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      active: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
      exclusive: { //private
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      tokens_input: {
        type:DataTypes.INTEGER,
        allowNull: true
      },
      tokens_output: {
        type:DataTypes.INTEGER,
        allowNull: true
      },
      tokens_total: {
        type:DataTypes.INTEGER,
        allowNull: true
      },
      likes: {
        type:DataTypes.INTEGER,
        allowNull: true
      },
      dislikes: {
        type:DataTypes.INTEGER,
        allowNull: true
      },
      downloads: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      remix_workflows: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: true
      },
      remix_from: {
        type: DataTypes.STRING(36),
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('workflows');
  }
};