@@ .. @@
           ) : (
             msgs.map((msg: any) => (
               <div key={msg.id} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'} mb-6`}>
                 <RobotCloud
                   text={msg.text}
                   isOwn={msg.type === 'user'}
                   isAI={msg.type === 'ai'}
                   isUser={msg.type === 'user'}
+                  timestamp={msg.ts ? new Date(msg.ts.toMillis()).toLocaleTimeString('en-US', { 
+                    hour: 'numeric', 
+                    minute: '2-digit', 
+                    hour12: true 
+                  }) : ''}
                 />
               </div>
             ))
           )}