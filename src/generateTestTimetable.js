import { supabase } from "./supabaseClient";

export async function generateTestTimetable() {
  console.log("Starting timetable generation...");

  // -----------------------------
  // 1️⃣ Hardcode one test class
  // -----------------------------
  const CLASS_ID = "1";

  // -----------------------------
  // 2️⃣ Load schedulable periods
  // -----------------------------
  const { data: periods, error: periodError } = await supabase
    .from("periods")
    .select(`
      id,
      period_number,
      day_id,
      days ( order_index )
    `)
    .eq("is_schedulable", true)
    .order("order_index", { foreignTable: "days" })
    .order("period_number");

  if (periodError) {
    console.error("Error loading periods", periodError);
    return;
  }

  if (!periods || periods.length === 0) {
    console.error("No schedulable periods found");
    return;
  }

  // -----------------------------
  // 3️⃣ Get class grade
  // -----------------------------
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("grade_id")
    .eq("id", CLASS_ID)
    .single();

  if (classError) {
    console.error("Error loading class", classError);
    return;
  }

  const gradeId = classData.grade_id;

  // -----------------------------
  // 4️⃣ Get subject hours (non-split)
  // -----------------------------
  const { data: subjectHours, error: subjectError } = await supabase
    .from("grade_subject_hours")
    .select("subject_id, hours_per_week")
    .eq("grade_id", gradeId);

  if (subjectError) {
    console.error("Error loading subject hours", subjectError);
    return;
  }

  if (!subjectHours || subjectHours.length === 0) {
    console.error("No subjects found for this grade");
    return;
  }

  // -----------------------------
  // 5️⃣ Assign one teacher per subject
  // -----------------------------
  const subjectTeacherMap = {};

  for (const sh of subjectHours) {
    const { data: teacher, error } = await supabase
      .from("teacher_subjects")
      .select("teacher_id")
      .eq("subject_id", sh.subject_id)
      .limit(1)
      .single();

    if (error || !teacher) {
      console.error("No teacher found for subject", sh.subject_id);
      return;
    }

    subjectTeacherMap[sh.subject_id] = teacher.teacher_id;
  }

  // -----------------------------
  // 6️⃣ Build lesson list
  // -----------------------------
  const lessons = [];

  for (const sh of subjectHours) {
    for (let i = 0; i < sh.hours_per_week; i++) {
      lessons.push({
        subject_id: sh.subject_id,
        teacher_id: subjectTeacherMap[sh.subject_id],
      });
    }
  }

  // Check there are enough periods
  if (lessons.length > periods.length) {
    console.error(
      `Not enough periods! Lessons: ${lessons.length}, periods: ${periods.length}`
    );
    return;
  }

  // -----------------------------
  // 7️⃣ Place lessons into periods
  // -----------------------------
  const inserts = [];

  for (let i = 0; i < lessons.length; i++) {
    const period = periods[i];
    const lesson = lessons[i];

    inserts.push({
      class_id: CLASS_ID,
      subject_id: lesson.subject_id,
      teacher_id: lesson.teacher_id,
      day_id: period.day_id,
      period_id: period.id,
      group_id: null,
    });
  }

  // -----------------------------
  // 8️⃣ Insert into timetable_entries
  // -----------------------------
  const { error: insertError } = await supabase
    .from("timetable_entries")
    .insert(inserts);

  if (insertError) {
    console.error("Insert failed", insertError);
    return;
  }

  console.log("Timetable generated successfully!");
}
