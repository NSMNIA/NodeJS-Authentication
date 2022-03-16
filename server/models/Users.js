module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        uid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    Users.assosiate = (models) => {
        Users.hasMany(models.Roles, {
            onDelete: "cascade"
        })
    }

    return Users;
}