module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define("Roles", {
        rid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Roles;
}