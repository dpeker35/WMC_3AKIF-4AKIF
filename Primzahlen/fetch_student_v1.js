const p = fetch("http://localhost:8000/student");
//p ist ein promise
p.then((response) => response.json()). //auf dieser response rufe ich auf, was wieder ein promise objekt ist
//also response.json() gibt ein promise zurück
    then((student) => {
    console.log(student);

});
