

export default class UserModel{
    constructor(id, name, email, password){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static add(name, email, password){
        const newUsers = new UserModel(users.length+1, name, email, password);
        console.log(name, email, password);
        users.push(newUsers);
    }

    static checkLogin(email, password){
        console.log("🔍 Checking Login for:", email, password);
        const check = users.find((u)=> u.email == email && u.password == password);

        if (check) {
            console.log("User Found:", check);
        } else {
            console.log(" Invalid Credentials");
        }
    

        return check ? check : null;
    }

    static userDetails(){
        return users;
    }
}

let users = [];