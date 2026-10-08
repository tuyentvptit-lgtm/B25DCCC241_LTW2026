const { useState } = React;

const initialStudents = [
  { id: 1, name: "Trần Văn Tuyên", score: 10, class: "D25CQCC-01" },
  { id: 2, name: "Elon Musk", score: 5, class: "Life" },
  { id: 3, name: "Kim Jong Un", score: 4.9, class: "Rocket" },
  { id: 4, name: "Donal Trump", score: 9.6, class: "Nig" },
];

const StudentItem = ({ student, index, onDelete }) => {
  const { id, name, score, class: classroom } = student;

  const getBadge = () => {
    if (score >= 8) return { text: "Giỏi", cls: "badge-good" };
    if (score < 5) return { text: "Trượt", cls: "badge-fail" };
    return { text: "Đạt", cls: "badge-normal" };
  };
  const { text, cls } = getBadge();

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{classroom}</td>
      <td>{score}</td>
      <td><span className={`badge ${cls}`}>{text}</span></td>
      <td><button className="btn btn-danger" onClick={() => onDelete(id)}>Xóa</button></td>
    </tr>
  );
};

const StudentList = ({ students, onDelete }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>#</th><th>Họ tên</th><th>Lớp</th><th>Điểm</th><th>Xếp loại</th><th></th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 ? (
          <tr><td colSpan="6" className="empty">Không có sinh viên nào.</td></tr>
        ) : (
          students.map((student, index) => (
            <StudentItem key={student.id} student={student} index={index} onDelete={onDelete} />
          ))
        )}
      </tbody>
    </table>
  </div>
);

const StudentForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [classroom, setClassroom] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const scoreNum = Number(score);

    if (!name.trim() || score === "" || !classroom.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên, điểm số và lớp.");
      return;
    }
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm số phải nằm trong khoảng từ 0 đến 10.");
      return;
    }

    onAdd({ name: name.trim(), score: scoreNum, class: classroom.trim() });
    setName(""); setScore(""); setClassroom(""); setError("");
  };

  return (
    <div className="card">
      <h2>Thêm sinh viên mới</h2>
      <div className="form">
        <div className="form-group">
          <label>Họ tên</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
        </div>
        <div className="form-group">
          <label>Điểm số</label>
          <input type="number" step="0.1" value={score} onChange={(e) => setScore(e.target.value)} placeholder="0 - 10" />
        </div>
        <div className="form-group">
          <label>Lớp</label>
          <input value={classroom} onChange={(e) => setClassroom(e.target.value)} placeholder="D21CQCN01" />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>Thêm</button>
      </div>
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all");

  const addStudent = (data) => {
    setStudents([...students, { id: Date.now(), ...data }]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const visibleStudents = students.filter(({ score }) => {
    if (filter === "good") return score >= 8;
    if (filter === "fail") return score < 5;
    return true;
  });

  const total = students.length;
  const average = total
    ? (students.reduce((sum, { score }) => sum + score, 0) / total).toFixed(2)
    : 0;

  const filterButtons = [
    { key: "all", label: "Tất cả" },
    { key: "good", label: "Giỏi" },
    { key: "fail", label: "Trượt" },
  ];

  return (
    <div className="app">
      <h1 className="app-title">Quản lý Điểm Sinh viên</h1>

      <div className="stats">
        <div className="stat-box">
          <div className="stat-label">Tổng số sinh viên</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Điểm trung bình</div>
          <div className="stat-value">{average}</div>
        </div>
      </div>

      <StudentForm onAdd={addStudent} />

      <div className="card">
        <h2>{`Danh sách sinh viên (${visibleStudents.length})`}</h2>
        <div className="filters">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              className={`btn btn-filter ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <StudentList students={visibleStudents} onDelete={deleteStudent} />
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
