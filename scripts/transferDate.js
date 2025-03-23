   // Load blog articles
   fetch("videos.json")
   .then((res) => res.json())
   .then(async (resources) => {
    
        const batch = db.batch();
        const collectionRef = db.collection("videos");
      
        resources.forEach((resource) => {
          const docRef = collectionRef.doc(); // Auto-generate document ID
          batch.set(docRef, resource);
        });
      
        try {
          await batch.commit();
          console.log("Data successfully uploaded to Firestore");
        } catch (error) {
          console.error("Error uploading data: ", error);
        }
   
   })