import bcrypt from "bcrypt";


export const hashPassword = async (password:string)=>{
    //# ->  Hashear password
    const salt = await bcrypt.genSalt(10) //Valor aleatorio y unco que se genera para cada contraseñaa
    return await bcrypt.hash(password, salt );
}
export const checkPassword = async(enteredPassword:string, storeHash:string) => {
    return await bcrypt.compare(enteredPassword,storeHash);
}