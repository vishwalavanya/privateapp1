@@ .. @@
 interface RobotCloudProps {
   text?: string;
   imageUrl?: string;
   fileName?: string;
   isOwn?: boolean;
   isAI?: boolean;
   isUser?: boolean;
   type?: string;
   currentUserNickname?: string;
   timestamp?: string;
 }

 function RobotCloud({ 
   text, 
   imageUrl, 
   fileName, 
   isOwn = false, 
   isAI = false,
   isUser = false,
   type,
   currentUserNickname,
   timestamp
 }: RobotCloudProps) {
   const [showDownloadButton, setShowDownloadButton] = React.useState(false);

   const handleDownload = () => {
     if (imageUrl && fileName) {
       const link = document.createElement('a');
       link.href = imageUrl;
       link.download = fileName;
       link.target = '_blank';
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
     }
   };

   const handleImageClick = () => {
     if (imageUrl) {
       setShowDownloadButton(!showDownloadButton);
     }
   };

   if (isAI || isUser) {
     return (
       <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 mt-4`}>
         {!isUser && (
           <div className="flex items-end gap-2">
             <div className="text-lg">🤖</div>
-            <div className="max-w-[80vw] sm:max-w-[320px]">
+            <div className="max-w-[80vw] sm:max-w-[320px] message-bubble">
               <div className="bg-gradient-to-br from-green-100 to-emerald-100 \
                               rounded-2xl px-4 py-3 shadow-lg border border-green-200 break-words whitespace-pre-wrap">
                 <p className="text-gray-700 font-medium">{text}</p>
               </div>
               {timestamp && (
-                <div className="text-xs text-gray-400 mt-1 px-2">
+                <div className="text-xs text-gray-400 mt-1 px-2 select-none">
                   {timestamp}
                 </div>
               )}
             </div>
           </div>
         )}

         {isUser && (
-          <div className="max-w-[80vw] sm:max-w-[320px]">
+          <div className="max-w-[80vw] sm:max-w-[320px] message-bubble">
             <div className="bg-gradient-to-br from-blue-100 to-sky-100 \
                             rounded-2xl px-4 py-3 shadow-lg border border-blue-200 break-words whitespace-pre-wrap">
               <p className="text-gray-700 font-medium">{text}</p>
             </div>
             {timestamp && (
-              <div className="text-xs text-gray-400 mt-1 px-2 text-right">
+              <div className="text-xs text-gray-400 mt-1 px-2 text-right select-none">
                 {timestamp}
               </div>
             )}
           </div>
         )}
       </div>
     );
   }

   return (
     <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-6 mt-4`}>
       {!isOwn && (
         <div className="flex items-end gap-2">
           <div className="text-lg">🤖</div>
-          <div className="max-w-[80vw] sm:max-w-[320px] bg-gradient-to-br from-green-100 to-emerald-100 \
+          <div className="max-w-[80vw] sm:max-w-[320px] message-bubble">
+            <div className="bg-gradient-to-br from-green-100 to-emerald-100 \
                           rounded-2xl px-4 py-3 shadow-lg border border-green-200 break-words whitespace-pre-wrap">
-            {text && <p className="text-gray-700 font-medium">{text}</p>}
-            {imageUrl && (
-              <div className="relative mt-2">
-                <img 
-                  src={imageUrl} 
-                  alt={fileName || 'Shared image'}
-                  className="w-full max-w-[200px] h-auto rounded-2xl shadow-md cursor-pointer \
-                             hover:shadow-lg transition-shadow duration-200"
-                  style={{ maxHeight: '300px', objectFit: 'cover' }}
-                  onClick={handleImageClick}
-                />
-                {showDownloadButton && (
-                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
-                    <div className="flex gap-2">
-                      <button
-                        onClick={handleDownload}
-                        className="bg-green-500 text-white px-4 py-2 rounded-xl \
-                                   hover:bg-green-600 transform hover:scale-105 \
-                                   transition-all duration-200 shadow-lg \
-                                   flex items-center gap-2"
-                        title="Download image"
-                      >
-                        <Download className="w-4 h-4" />
-                        Download
-                      </button>
-                      <button
-                        onClick={() => setShowDownloadButton(false)}
-                        className="bg-gray-500 text-white px-3 py-2 rounded-xl \
-                                   hover:bg-gray-600 transform hover:scale-105 \
-                                   transition-all duration-200 shadow-lg"
-                        title="Close"
-                      >
-                        <X className="w-4 h-4" />
-                      </button>
+              {text && <p className="text-gray-700 font-medium">{text}</p>}
+              {imageUrl && (
+                <div className="relative mt-2">
+                  <img 
+                    src={imageUrl} 
+                    alt={fileName || 'Shared image'}
+                    className="w-full max-w-[200px] h-auto rounded-2xl shadow-md cursor-pointer \
+                               hover:shadow-lg transition-shadow duration-200"
+                    style={{ maxHeight: '300px', objectFit: 'cover' }}
+                    onClick={handleImageClick}
+                  />
+                  {showDownloadButton && (
+                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
+                      <div className="flex gap-2">
+                        <button
+                          onClick={handleDownload}
+                          className="bg-green-500 text-white px-4 py-2 rounded-xl \
+                                     hover:bg-green-600 transform hover:scale-105 \
+                                     transition-all duration-200 shadow-lg \
+                                     flex items-center gap-2"
+                          title="Download image"
+                        >
+                          <Download className="w-4 h-4" />
+                          Download
+                        </button>
+                        <button
+                          onClick={() => setShowDownloadButton(false)}
+                          className="bg-gray-500 text-white px-3 py-2 rounded-xl \
+                                     hover:bg-gray-600 transform hover:scale-105 \
+                                     transition-all duration-200 shadow-lg"
+                          title="Close"
+                        >
+                          <X className="w-4 h-4" />
+                        </button>
+                      </div>
                     </div>
-                  </div>
-                )}
-              </div>
-            )}
+                  )}
+                </div>
+              )}
+            </div>
+            {timestamp && (
+              <div className="text-xs text-gray-400 mt-1 px-2 select-none">
+                {timestamp}
+              </div>
+            )}
+          </div>
+        </div>
+      )}
+      
+      {isOwn && (
+        <div className="max-w-[80vw] sm:max-w-[320px] message-bubble">
+          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 \
+                          text-white rounded-2xl px-4 py-3 shadow-lg break-words whitespace-pre-wrap">
+            {text && <p className="font-medium">{text}</p>}
+            {imageUrl && (
+              <div className="relative mt-2">
+                <img 
+                  src={imageUrl} 
+                  alt={fileName || 'Shared image'}
+                  className="w-full max-w-[200px] h-auto rounded-2xl shadow-md cursor-pointer \
+                             hover:shadow-lg transition-shadow duration-200"
+                  style={{ maxHeight: '300px', objectFit: 'cover' }}
+                  onClick={handleImageClick}
+                />
+                {showDownloadButton && (
+                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
+                    <div className="flex gap-2">
+                      <button
+                        onClick={handleDownload}
+                        className="bg-green-500 text-white px-4 py-2 rounded-xl \
+                                   hover:bg-green-600 transform hover:scale-105 \
+                                   transition-all duration-200 shadow-lg \
+                                   flex items-center gap-2"
+                        title="Download image"
+                      >
+                        <Download className="w-4 h-4" />
+                        Download
+                      </button>
+                      <button
+                        onClick={() => setShowDownloadButton(false)}
+                        className="bg-gray-500 text-white px-3 py-2 rounded-xl \
+                                   hover:bg-gray-600 transform hover:scale-105 \
+                                   transition-all duration-200 shadow-lg"
+                        title="Close"
+                      >
+                        <X className="w-4 h-4" />
+                      </button>
+                    </div>
+                  </div>
+                )}
+              </div>
+            )}
           </div>
+          {timestamp && (
+            <div className="text-xs text-gray-400 mt-1 px-2 text-right select-none">
+              {timestamp}
+            </div>
+          )}
         </div>
       )}
     </div>
   );
 }