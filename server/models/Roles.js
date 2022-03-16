module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define("Roles", {
        rid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    });

    Roles.associate = (models) => {
        Roles.hasMany(models.Users, { foreignKey: 'rid' })
    };

    setTimeout(() => {
        Roles.bulkCreate([
            { role_name: 'client' },
            { role_name: 'manager' },
            { role_name: 'admin' },
        ]).then(() => console.log("Roles added"))
            .catch(() => console.error("Roles already existing"));
    }, 500)

    return Roles;
}