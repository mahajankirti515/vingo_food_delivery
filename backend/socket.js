import User from "./models/user.model.js"

export const socketHandler=async(io)=>{
    io.on('connection',(socket)=>{
        socket.on('identity',async({userId})=>{
            try {
                const user = await User.findByIdAndUpdate(userId,{
                    socketId:socket.id,
                    isOnline:true
                }, {new:true})
            } catch (error) {
                console.log(error)
            }
        })

        socket.on("update-location", async({latitude,longitude,userId})=>{
            try {
                const user = await User.findByIdAndUpdate(userId,{
                    location:{
                        type:"Point",
                        coordinates:[longitude,latitude]
                    },
                    isOnline:true,
                    socketId:socket.id
                })

                io.emit("update-location", {
                    userId: userId,
                    latitude,
                    longitude
                })

            } catch (error) {
                console.log('update delivery location error')
            }
        })

        socket.on('disconnect',async()=>{
            try {
                const user = await User.findOneAndUpdate({socketId:socket.id},{
                    socketId:null,
                    isOnline:false
                }, {new:true})
            } catch (error) {
                console.log(error)
            }
        })
        
    })
}