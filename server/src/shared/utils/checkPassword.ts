import * as bcrypt from 'bcryptjs';

export const checkPassword=(enteredPassword:string,hashedPwd:string)=>{
    return bcrypt.compareSync(enteredPassword,hashedPwd)
}