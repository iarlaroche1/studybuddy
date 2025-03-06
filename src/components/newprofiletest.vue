<template>
    <div>
        <input type="file" @change="handleFileChange" />
        <button @click="uploadImage">Submit</button>
    </div>
</template>

<script>
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
    name: "NewProfileTest",
    methods: {
        async uploadImage(event) {
            const file = event.target.files[0];
            if (!file) return;

            const storage = getStorage();
            const storageRef = ref(storage, `profileImages/${file.name}`);

            try {
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                console.log("File available at", url);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>