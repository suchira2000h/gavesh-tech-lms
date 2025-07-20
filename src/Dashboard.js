import React, { useEffect, useState } from "react";
import { db, storage } from "./firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Dashboard({ user, role }) {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [uploads, setUploads] = useState({});
  const [uploadingTaskId, setUploadingTaskId] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      const q = query(collection(db, "tasks"));
      const snapshot = await getDocs(q);
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    if (role === "admin") {
      async function fetchStudents() {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const snapshot = await getDocs(q);
        setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
      fetchStudents();
    }
  }, [role]);

  async function handleUpload(e, taskId) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingTaskId(taskId);

    const storageRef = ref(storage, `submissions/${user.uid}/${taskId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    const submissionRef = doc(db, "users", user.uid);
    await updateDoc(submissionRef, {
      [`submissions.${taskId}`]: url,
    });

    setUploads((prev) => ({ ...prev, [taskId]: url }));
    setUploadingTaskId(null);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Welcome, {user.email}</h2>
      <p className="mb-4">
        Role: <span className="font-bold">{role.toUpperCase()}</span>
      </p>

      {role === "student" && (
        <>
          <h3 className="text-md font-semibold mb-2">Your Tasks</h3>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="border rounded p-3 bg-white flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <div>
                  <input
                    type="file"
                    onChange={(e) => handleUpload(e, task.id)}
                    disabled={uploadingTaskId === task.id}
                    className="mb-1"
                  />
                  {uploads[task.id] && (
                    <a
                      href={uploads[task.id]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View submission
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {role === "admin" && (
        <>
          <h3 className="text-md font-semibold mb-2">Students</h3>
          <ul className="space-y-3">
            {students.map((student) => (
              <li
                key={student.id}
                className="border rounded p-3 bg-white flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{student.email}</p>
                  <p className="text-sm">Level: {student.level || "Explorer"}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
