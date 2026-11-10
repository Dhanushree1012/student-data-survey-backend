import { studentRecords } from '../data/mockData';

export function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Students</h2>
        <input placeholder="Search student or SI number" className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>SI Number</th>
              <th>Name</th>
              <th>Class</th>
              <th>Sex</th>
              <th>Status</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {studentRecords.map((student) => (
              <tr key={student.id}>
                <td>{student.siNumber}</td>
                <td>{student.studentName}</td>
                <td>{student.className}</td>
                <td>{student.sex}</td>
                <td><span className="badge bg-cyan-100 text-cyan-700">{student.status}</span></td>
                <td>{student.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

