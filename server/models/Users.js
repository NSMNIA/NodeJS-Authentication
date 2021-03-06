const bcrypt = require('bcrypt');

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
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        remember_token: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Users.associate = (models) => {
        Users.belongsTo(models.Roles, { foreignKey: 'rid' })
    };

    setTimeout(() => {
        bcrypt.hash('admin', 11).then((hash) => {
            Users.create({
                email: 'kevinstoop9@gmail.com',
                firstname: "Kevin",
                lastname: "Stoop",
                password: hash,
                email_verified_at: Date.now(),
                rid: 3
            }).then(() => console.log("Super admin added"))
                .catch(() => console.log("Super admin already created."));
        })
    }, 500)

    return Users;
}