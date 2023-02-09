import { useState, useRef, useEffect } from "react";
import './App.css';
import { Container, Form, Col, Row, Button, Modal, Table } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash } from 'react-icons/fa';
import LineChart from './LineChart.js';

import useLocalStorage from "react-localstorage-hook";
import { courses } from './courses.js';

function App() {
  const yearRef = useRef();
  const semRef = useRef();
  const subRef = useRef();
  const gradeRef = useRef();

  const [singleSelections, setSingleSelections] = useState([]);
  const [dataCourses, setDataCourses] = useLocalStorage("dataCourses", []);
  

  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const dummySemYear = [2019, 2020, 2021, 2022, 2023, 2024]
  const dummySem = [1, 2, 3]
  const dummyGrade = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'W']
  const dummyCred = [4, 3.75, 3.25, 3, 2.75, 2.25, 2, 1.75, 1, null]

  const options1 = dummySemYear.map((v, k) => {
    return <option>{v}</option>
  })
  const options2 = dummySem.map((v, k) => {
    return <option>{v}</option>
  })
  const options4 = dummyGrade.map((v, k) => {
    return <option>{v}</option>
  })

  const addSubject = () => {
    
    const subjectCode = subRef.current.state.selected[0].code;
    const subjectName = subRef.current.state.selected[0].name;
    setSingleSelections([]);

    var found = false;
    dataCourses.forEach(course => {
      if (course.code == subjectCode) {
        handleShow1();
        course.grade = gradeRef.current.value;
        course.year = yearRef.current.value;
        course.sem = semRef.current.value;
        found = true;
        return;
      }
    })
    if (!found) {
      var itemObj = {
        code: subjectCode,
        name: subjectName,
        year: yearRef.current.value,
        sem: semRef.current.value,
        grade: gradeRef.current.value
      };
      dataCourses.push(itemObj);
    }
    setDataCourses([...dataCourses]);
    handleClose();
  }

  const removeAll = () => {
    setDataCourses([]);
    gpaPerSem = [];
    perSem = [];
  }
  const deleteClick = (i) => {
    dataCourses.splice(i, 1);
    setDataCourses([...dataCourses]);
  }

  let gpaPerSem = [];
  let perSem = [];

  function RenderGPA({ data, setDataCourses }) {

    data.sort((a, b) => {
      if (a.year === b.year) {
        return a.sem - b.sem;
      }
      return a.year > b.year ? 1 : -1;
    });

    const [dataRows, setDataRows] = useState();
    const [totalGPA, setTotalGPA] = useState(0);

    useEffect(() => {

      let gpaPerSem1 = [];
      let perSem1 = [];

      if (data.length == 0) {
        const w = <h2 style={{ textAlign: 'center' }}>Please Add a Subject.</h2>
        return setDataRows(w);
      }
      else {
        let nowYear = data[0].year;
        let nowSem = data[0].sem;

        let semGrade = 0;
        let count1 = 0;
        const z = data.map((w, k) => {
          if (nowYear === w.year && nowSem === w.sem) {
            semGrade += dummyCred[dummyGrade.indexOf(w.grade)];
            count1 += 1;
          }

          else if (nowYear != w.year || nowSem != w.sem) {
            nowYear = w.year;
            nowSem = w.sem;
            gpaPerSem1.push((semGrade / count1).toFixed(2));
            semGrade = dummyCred[dummyGrade.indexOf(w.grade)];
            count1 = 1;
          }

          if (k === data.length - 1) {
            gpaPerSem1.push((semGrade / count1).toFixed(2));
          }

        })
        let sumGrade = 0;
        const x = gpaPerSem1.map((l) => {
          sumGrade += parseFloat(l);
        })

        setTotalGPA((sumGrade / gpaPerSem1.length).toFixed(2))

        let currentYear = 0;
        let currentSem = 0;
        let count = -1;
        const y = data.map((v, i) => {
          if (currentYear === v.year && currentSem === v.sem) {
            return (
              <Row>
                <Col xs='1' style={{ textAlign: 'center' }}><FaTrash onClick={() => deleteClick(i)} /></Col>
                <Col xs = '2'>
                  {v.code}
                </Col>
                <Col xs='6'>
                  {v.name}
                </Col>
                <Col style={{ textAlign: 'center' }}>
                  {v.grade}
                </Col>

              </Row>
            );
          }

          else {
            currentYear = v.year;
            currentSem = v.sem;
            count += 1
            let obj = v.sem + '/' + v.year
            perSem1.push(obj);
            return (
              <div>
                <br />
                <Row style={{ textAlign: 'center' }}>

                  <Col className="sem-head">
                    Semester: {v.sem}/{v.year}
                  </Col>
                  <Col xs='6'>
                  </Col>
                  <Col>
                    GPA: {gpaPerSem1[count]}
                  </Col>

                </Row>

                <Row>
                  <Col xs='1' style={{ textAlign: 'center' }}><FaTrash onClick={() => deleteClick(i)} /></Col>
                  <Col xs='2'>
                    {v.code}
                  </Col>
                  <Col xs='6'>
                    {v.name}
                  </Col>
                  <Col style={{ textAlign: 'center' }}>
                    {v.grade}
                  </Col>

                </Row>

              </div>
            )
          }
        })
        setDataRows(y);
        gpaPerSem = [...gpaPerSem1];
        perSem = [...perSem1];
        
      }
    }, [data]);


    return (
      <div >
        <Container>
          <h1 style={{ paddingTop: '5vh', textAlign: 'center' }}>
          Cumulative GPA: {totalGPA}
            <div className="remove">
              <Button className="removeAll" variant="outline-red" onClick={removeAll}>
                Clear All
              </Button>
            </div>
          </h1>

          <div className="form1">
            {dataRows}
          </div>

          <LineChart gpaPerSem={gpaPerSem} perSem={perSem}/>
        </Container>

      </div>
    )
  }



  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      <RenderGPA data={dataCourses} setDataCourses={setDataCourses} />

      <br />

      <div style={{ textAlign: 'center' }}>
        <Button className="addSub" variant="danger " onClick={handleShow}>
          Add a Subject
        </Button>
      </div>


      <Modal className="my-modal" size="lg" show={show} onHide={handleClose} aria-labelledby="example-modal-sizes-title-lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form>
            <Form.Group className="mb-3" controlId="formSem">
              <Form.Label>SEMESTER: </Form.Label>
              <div className="row">
                <div className="col-sm-7">
                  <Form.Select aria-label="Default select example" ref={yearRef} >
                    {options1}
                  </Form.Select>
                </div>
                <div className="col-sm-5">
                  <Form.Select aria-label="Default select example" ref={semRef} >
                    {options2}
                  </Form.Select>
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSub">
              <Form.Label>SUBJECT: </Form.Label>
              <Typeahead
                className="modal-box"
                id="basic-typeahead-single" labelKey="name"
                onChange={setSingleSelections}
                options={courses}
                placeholder="Choose a subject..."
                selected={singleSelections}
                ref={subRef}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSub">
              <Form.Label>GRADE: </Form.Label>
              <Form.Select aria-label="Default select example" ref={gradeRef} >
                {options4}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="#000000" onClick={handleClose}>
            Close
          </Button>
          <Button variant="#000000" onClick={addSubject}>
            ADD
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className="my-modal" show={show1} onHide={handleClose1} aria-labelledby="example-modal-sizes-title-lg" centeredtr>
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Course Already Exists</Modal.Title>
        </Modal.Header>

        <Modal.Body> The following course has been updated. </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleClose1}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default App;
