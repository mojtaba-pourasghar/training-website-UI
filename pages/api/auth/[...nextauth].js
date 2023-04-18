import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
    session: {
        strategy: "jwt",
    },
    providers:[
        CredentialProvider({
           type:'credentials',
           async authorize(credentials,req){
            try {
                  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}v1/auth/signin`, credentials);           
                  if (res.status === 200) {
                    // Return user object and JWT token
                    
                    const user =  {
                      id: res.data.id,
                      name: res.data.username,
                      email: res.data.email,
                      roles: res.data.roles,
                      jwt: res.data.token,
                    };
                    user.isAdmin = true;
                    return user;
                  }
              } catch (error) {
                throw new Error(error.message);
                //return null;
              }
           } 
        })
    ],
    pages : {
        signIn : `/${process.env.ADMIN}/auth/login`
    },
    callbacks: {        
        async jwt({ token, user }) {
          // the user present here gets the same data as received from DB call  made above -> fetchUserInfo(credentials.opt)
        
        return { ...token, ...user }
        },
        async session({ session, user, token }) {
        // user param present in the session(function) does not recive all the data from DB call -> fetchUserInfo(credentials.opt)
        
        return token
        }
  }

});






