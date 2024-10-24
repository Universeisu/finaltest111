const getLocalAccessToken = () => {
    const user = getUser(); // Assuming getUser retrieves the user object with the token
    return user?.accessToken; 
  };
  
  const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
  
  const removeUser = () => {
    localStorage.removeItem("user");
  };
  
  const Tokenservice = {
    getLocalAccessToken,
    setUser,
    getUser,
    removeUser,
  };
  
  export default Tokenservice;