import React from "react"
import {View,Text} from "react-native"

const MessageBubble = ({role,text})=>{
    return(
        <View className={`p-3 rounded-lg my-2 ${role ==="user" ? "bg-blue-200 self-end" : "bg-gray-300 self-start"}`}>
            <Text className="text-black">{role === "user" ? "👦" : "👾"}{text}</Text>
        </View>
    )
    
}

export default MessageBubble