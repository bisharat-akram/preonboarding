export const createUser = (data) => {
	return {
		type: 'STOREUSER',
		payload: data
	}
}

export const removeUser = ()=>{
    return {
        type: "REMOVEUSER"
    }
}