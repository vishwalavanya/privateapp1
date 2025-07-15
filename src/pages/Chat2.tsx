@@ .. @@
           ) : (
             msgs.map((msg: any) => (
-              <RobotCloud
-                key={msg.id}
-                text={msg.text}
-                imageUrl={msg.imageUrl}
-                fileName={msg.fileName}
-                isOwn={msg.by === nickname}
-                isUser={msg.by === nickname}
-                isAI={msg.by !== nickname && msg.text?.startsWith('🤖')}
-                type={msg.type}
-                currentUserNickname={nickname}
-                timestamp={formatMessageTime(msg.ts)}
-              />
+              <div key={msg.id}>
+                <RobotCloud
+                  text={msg.text}
+                  imageUrl={msg.imageUrl}
+                  fileName={msg.fileName}
+                  isOwn={msg.by === nickname}
+                  isUser={msg.by === nickname}
+                  isAI={msg.by !== nickname && msg.text?.startsWith('🤖')}
+                  type={msg.type}
+                  currentUserNickname={nickname}
+                  timestamp={formatMessageTime(msg.ts)}
+                />
+              </div>
             ))
           )}