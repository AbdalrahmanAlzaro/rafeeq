"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const adminHash = bcrypt.hashSync("Admin@123", 10);
    const teacherHash = bcrypt.hashSync("Teacher@123", 10);
    const parentHash = bcrypt.hashSync("Parent@123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        name_en: "Rafeeq Admin",
        name_ar: "مدير رفيق",
        email: "admin@rafeeq.com",
        phone: "+962790000001",
        password_hash: adminHash,
        national_id: "9870000001",
        role: "school_admin",
        avatar_url: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name_en: "Sara Al-Ahmad",
        name_ar: "سارة الأحمد",
        email: "sara@rafeeq.com",
        phone: "+962790000002",
        password_hash: teacherHash,
        national_id: "9870000002",
        role: "teacher",
        avatar_url: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name_en: "Omar Al-Khalidi",
        name_ar: "عمر الخالدي",
        email: "omar@rafeeq.com",
        phone: "+962790000003",
        password_hash: teacherHash,
        national_id: "9870000003",
        role: "teacher",
        avatar_url: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name_en: "Ahmad Al-Mansour",
        name_ar: "أحمد المنصور",
        email: "ahmad@rafeeq.com",
        phone: "+962790000004",
        password_hash: parentHash,
        national_id: "9870000004",
        role: "parent",
        avatar_url: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        name_en: "Lina Hassan",
        name_ar: "لينا حسن",
        email: "lina@rafeeq.com",
        phone: "+962790000005",
        password_hash: parentHash,
        national_id: "9870000005",
        role: "parent",
        avatar_url: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        name_en: "Khalid Al-Nasser",
        name_ar: "خالد الناصر",
        email: "khalid@rafeeq.com",
        phone: "+962790000006",
        password_hash: parentHash,
        national_id: "9870000006",
        role: "parent",
        avatar_url: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Schools", [
      {
        id: 1,
        name_en: "Al-Amal Special Education School",
        name_ar: "مدرسة الأمل للتربية الخاصة",
        description_en:
          "A leading special education school in Amman dedicated to supporting children with learning difficulties and developmental disorders.",
        description_ar:
          "مدرسة رائدة في التعليم الخاص في عمان متخصصة في دعم الأطفال ذوي صعوبات التعلم والاضطرابات النمائية.",
        location_en: "Amman, Jordan",
        location_ar: "عمان، الأردن",
        logo_url: null,
        contact_email: "info@alamal.edu.jo",
        contact_phone: "+96264000001",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Teachers", [
      {
        id: 1,
        user_id: 2,
        school_id: 1,
        grade_en: "Grade 2",
        grade_ar: "الصف الثاني",
        section_en: "Section A",
        section_ar: "الشعبة أ",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        user_id: 3,
        school_id: 1,
        grade_en: "Grade 3",
        grade_ar: "الصف الثالث",
        section_en: "Section B",
        section_ar: "الشعبة ب",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Children", [
      {
        id: 1,
        parent_user_id: 4,
        teacher_id: 1,
        school_id: 1,
        name_en: "Yousef Al-Mansour",
        name_ar: "يوسف المنصور",
        date_of_birth: "2017-03-15",
        national_id: "1234567890",
        special_need_type: "autism",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        parent_user_id: 5,
        teacher_id: 1,
        school_id: 1,
        name_en: "Nour Hassan",
        name_ar: "نور حسن",
        date_of_birth: "2016-07-22",
        national_id: "1234567891",
        special_need_type: "adhd",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        parent_user_id: 6,
        teacher_id: 2,
        school_id: 1,
        name_en: "Rami Al-Nasser",
        name_ar: "رامي الناصر",
        date_of_birth: "2018-01-10",
        national_id: "1234567892",
        special_need_type: "dyslexia",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ChildNotes", [
      {
        id: 1,
        child_id: 1,
        teacher_id: 1,
        behavioral_notes_en:
          "Yousef tends to get frustrated when tasks take longer than expected. He responds better to short structured activities with clear start and end points.",
        behavioral_notes_ar:
          "يوسف يميل إلى الإحباط عندما تستغرق المهام وقتاً أطول من المتوقع. يستجيب بشكل أفضل للأنشطة القصيرة المنظمة ذات نقاط البداية والنهاية الواضحة.",
        communication_notes_en:
          "Responds well to visual instructions and picture cards. Verbal communication is limited to 2-3 word sentences.",
        communication_notes_ar:
          "يستجيب جيداً للتعليمات المرئية وبطاقات الصور. التواصل اللفظي محدود بجمل من 2-3 كلمات.",
        social_notes_en:
          "Prefers one-on-one interaction over group activities. Shows interest in other children but struggles to initiate contact.",
        social_notes_ar:
          "يفضل التفاعل الفردي على الأنشطة الجماعية. يُظهر اهتماماً بالأطفال الآخرين لكنه يجد صعوبة في بدء التواصل.",
        attention_notes_en:
          "Maximum focus span is approximately 8-10 minutes. Requires frequent short breaks and positive reinforcement.",
        attention_notes_ar:
          "مدة التركيز القصوى تقريباً 8-10 دقائق. يحتاج إلى فترات راحة قصيرة متكررة وتعزيز إيجابي.",
        additional_notes_en:
          "Yousef loves drawing and responds positively to color-based activities. Music also helps him focus.",
        additional_notes_ar:
          "يوسف يحب الرسم ويستجيب بشكل إيجابي للأنشطة القائمة على الألوان. الموسيقى أيضاً تساعده على التركيز.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        child_id: 2,
        teacher_id: 1,
        behavioral_notes_en:
          "Nour is energetic and impulsive. She needs constant movement opportunities and has difficulty staying seated for more than 5 minutes.",
        behavioral_notes_ar:
          "نور نشيطة ومندفعة. تحتاج إلى فرص حركة مستمرة وتجد صعوبة في البقاء جالسة لأكثر من 5 دقائق.",
        communication_notes_en:
          "Excellent verbal communication. Speaks in full sentences but often interrupts others and speaks out of turn.",
        communication_notes_ar:
          "تواصل لفظي ممتاز. تتحدث بجمل كاملة لكنها كثيراً ما تقاطع الآخرين وتتحدث خارج الدور.",
        social_notes_en:
          "Very social and friendly. Gets along well with peers but struggles with taking turns and sharing.",
        social_notes_ar:
          "اجتماعية جداً وودودة. تتعاون جيداً مع الأقران لكنها تجد صعوبة في الانتظار والمشاركة.",
        attention_notes_en:
          "Short attention span of about 5-7 minutes on structured tasks. Gamified and interactive activities hold her attention longer.",
        attention_notes_ar:
          "فترة انتباه قصيرة حوالي 5-7 دقائق للمهام المنظمة. الأنشطة التفاعلية والمحولة إلى ألعاب تجذب انتباهها لفترة أطول.",
        additional_notes_en:
          "Nour excels when given leadership roles in small group activities. Rewards system works very effectively with her.",
        additional_notes_ar:
          "تتفوق نور عندما تُمنح أدوار قيادية في أنشطة المجموعات الصغيرة. نظام المكافآت يعمل بفعالية كبيرة معها.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        child_id: 3,
        teacher_id: 2,
        behavioral_notes_en:
          "Rami is calm and cooperative but shows signs of anxiety when asked to read aloud or write in front of others.",
        behavioral_notes_ar:
          "رامي هادئ ومتعاون لكنه يُظهر علامات القلق عند طلب القراءة بصوت عالٍ أو الكتابة أمام الآخرين.",
        communication_notes_en:
          "Clear verbal communication. The main challenge is reading comprehension and letter recognition.",
        communication_notes_ar:
          "تواصل لفظي واضح. التحدي الرئيسي هو فهم القراءة والتعرف على الحروف.",
        social_notes_en:
          "Friendly and cooperative with peers. Works well in group settings when the task does not involve reading.",
        social_notes_ar:
          "ودود ومتعاون مع الأقران. يعمل بشكل جيد في بيئات المجموعات عندما لا تتضمن المهمة القراءة.",
        attention_notes_en:
          "Good attention span for non-reading tasks. Loses focus quickly when reading or writing is required.",
        attention_notes_ar:
          "فترة انتباه جيدة للمهام غير القرائية. يفقد التركيز بسرعة عند طلب القراءة أو الكتابة.",
        additional_notes_en:
          "Rami is very strong in math and spatial reasoning. Audio-based learning works much better than text-based for him.",
        additional_notes_ar:
          "رامي قوي جداً في الرياضيات والتفكير المكاني. التعلم القائم على الصوت يعمل معه بشكل أفضل بكثير من النصي.",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Subjects", [
      {
        id: 1,
        name_en: "Mathematics",
        name_ar: "الرياضيات",
        description_en: "Numerical reasoning, basic arithmetic, and problem solving skills",
        description_ar: "التفكير العددي والحساب الأساسي ومهارات حل المشكلات",
        color_code: "#508DF7",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name_en: "Communication Skills",
        name_ar: "مهارات التواصل",
        description_en: "Verbal and non-verbal communication, listening, and expression",
        description_ar: "التواصل اللفظي وغير اللفظي والاستماع والتعبير",
        color_code: "#FFB84C",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name_en: "Social Skills",
        name_ar: "المهارات الاجتماعية",
        description_en: "Interaction with others, sharing, cooperation, and emotional regulation",
        description_ar: "التفاعل مع الآخرين والمشاركة والتعاون والتنظيم العاطفي",
        color_code: "#BA6DE9",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name_en: "Cognitive Skills",
        name_ar: "المهارات المعرفية",
        description_en: "Memory, attention, problem solving, and logical thinking",
        description_ar: "الذاكرة والانتباه وحل المشكلات والتفكير المنطقي",
        color_code: "#1D9E75",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("QuestionBanks", [
      {
        id: 1,
        subject_id: 1,
        teacher_id: 1,
        question_text_en: "What is 3 + 4?",
        question_text_ar: "ما هو ناتج 3 + 4؟",
        options: JSON.stringify([
          { key: "a", value_en: "5", value_ar: "5" },
          { key: "b", value_en: "6", value_ar: "6" },
          { key: "c", value_en: "7", value_ar: "7" },
          { key: "d", value_en: "8", value_ar: "8" },
        ]),
        correct_answer: "c",
        difficulty: "easy",
        points: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        subject_id: 1,
        teacher_id: 1,
        question_text_en: "If you have 10 apples and give away 4, how many do you have left?",
        question_text_ar: "إذا كان لديك 10 تفاحات وأعطيت 4، كم تبقى لديك؟",
        options: JSON.stringify([
          { key: "a", value_en: "4", value_ar: "4" },
          { key: "b", value_en: "5", value_ar: "5" },
          { key: "c", value_en: "6", value_ar: "6" },
          { key: "d", value_en: "7", value_ar: "7" },
        ]),
        correct_answer: "c",
        difficulty: "medium",
        points: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        subject_id: 2,
        teacher_id: 1,
        question_text_en: "What do you say when you meet someone for the first time?",
        question_text_ar: "ماذا تقول عندما تقابل شخصاً للمرة الأولى؟",
        options: JSON.stringify([
          { key: "a", value_en: "Goodbye", value_ar: "مع السلامة" },
          { key: "b", value_en: "Hello", value_ar: "مرحباً" },
          { key: "c", value_en: "Thank you", value_ar: "شكراً" },
          { key: "d", value_en: "Sorry", value_ar: "آسف" },
        ]),
        correct_answer: "b",
        difficulty: "easy",
        points: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        subject_id: 2,
        teacher_id: 1,
        question_text_en: "Which of these is the best way to ask for help?",
        question_text_ar: "أي من هذه الطرق هي الأفضل لطلب المساعدة؟",
        options: JSON.stringify([
          { key: "a", value_en: "Cry loudly", value_ar: "البكاء بصوت عالٍ" },
          { key: "b", value_en: "Take what you need", value_ar: "أخذ ما تحتاجه" },
          {
            key: "c",
            value_en: "Say excuse me, can you help me?",
            value_ar: "قل عفواً، هل يمكنك مساعدتي؟",
          },
          { key: "d", value_en: "Stay silent", value_ar: "البقاء صامتاً" },
        ]),
        correct_answer: "c",
        difficulty: "medium",
        points: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        subject_id: 3,
        teacher_id: 1,
        question_text_en: "What should you do when a friend is sad?",
        question_text_ar: "ماذا يجب أن تفعل عندما يكون صديقك حزيناً؟",
        options: JSON.stringify([
          { key: "a", value_en: "Ignore them", value_ar: "تجاهله" },
          { key: "b", value_en: "Laugh at them", value_ar: "الضحك عليه" },
          { key: "c", value_en: "Ask if they are okay", value_ar: "اسأل إذا كان بخير" },
          { key: "d", value_en: "Walk away", value_ar: "الابتعاد" },
        ]),
        correct_answer: "c",
        difficulty: "easy",
        points: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        subject_id: 3,
        teacher_id: 1,
        question_text_en: "You are playing a game and it is not your turn yet. What do you do?",
        question_text_ar: "أنت تلعب لعبة وليس دورك بعد. ماذا تفعل؟",
        options: JSON.stringify([
          { key: "a", value_en: "Play anyway", value_ar: "العب على أي حال" },
          {
            key: "b",
            value_en: "Wait patiently for your turn",
            value_ar: "انتظر بصبر حتى يأتي دورك",
          },
          { key: "c", value_en: "Quit the game", value_ar: "اترك اللعبة" },
          { key: "d", value_en: "Complain loudly", value_ar: "الشكوى بصوت عالٍ" },
        ]),
        correct_answer: "b",
        difficulty: "medium",
        points: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 7,
        subject_id: 4,
        teacher_id: 1,
        question_text_en: "Which shape has 4 equal sides?",
        question_text_ar: "أي شكل له 4 أضلاع متساوية؟",
        options: JSON.stringify([
          { key: "a", value_en: "Triangle", value_ar: "مثلث" },
          { key: "b", value_en: "Circle", value_ar: "دائرة" },
          { key: "c", value_en: "Square", value_ar: "مربع" },
          { key: "d", value_en: "Rectangle", value_ar: "مستطيل" },
        ]),
        correct_answer: "c",
        difficulty: "easy",
        points: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 8,
        subject_id: 4,
        teacher_id: 1,
        question_text_en: "What comes next in this pattern? 2, 4, 6, 8, ___",
        question_text_ar: "ما الذي يأتي بعد ذلك في هذا النمط؟ 2، 4، 6، 8، ___",
        options: JSON.stringify([
          { key: "a", value_en: "9", value_ar: "9" },
          { key: "b", value_en: "10", value_ar: "10" },
          { key: "c", value_en: "11", value_ar: "11" },
          { key: "d", value_en: "12", value_ar: "12" },
        ]),
        correct_answer: "b",
        difficulty: "medium",
        points: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Exams", [
      {
        id: 1,
        teacher_id: 1,
        title_en: "Initial Assessment Exam — Grade 2 Section A",
        title_ar: "امتحان التقييم الأولي — الصف الثاني الشعبة أ",
        description_en:
          "This exam evaluates the child's current level across Math, Communication, Social, and Cognitive skills to generate a personalized learning tree.",
        description_ar:
          "يقيّم هذا الامتحان المستوى الحالي للطفل في الرياضيات ومهارات التواصل والاجتماعية والمعرفية لتوليد شجرة تعلم مخصصة.",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ExamSubjects", [
      { id: 1, exam_id: 1, subject_id: 1, total_marks: 3, createdAt: now, updatedAt: now },
      { id: 2, exam_id: 1, subject_id: 2, total_marks: 3, createdAt: now, updatedAt: now },
      { id: 3, exam_id: 1, subject_id: 3, total_marks: 3, createdAt: now, updatedAt: now },
      { id: 4, exam_id: 1, subject_id: 4, total_marks: 3, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert("ExamQuestions", [
      { id: 1, exam_id: 1, subject_id: 1, question_id: 1, order: 1, createdAt: now, updatedAt: now },
      { id: 2, exam_id: 1, subject_id: 1, question_id: 2, order: 2, createdAt: now, updatedAt: now },
      { id: 3, exam_id: 1, subject_id: 2, question_id: 3, order: 3, createdAt: now, updatedAt: now },
      { id: 4, exam_id: 1, subject_id: 2, question_id: 4, order: 4, createdAt: now, updatedAt: now },
      { id: 5, exam_id: 1, subject_id: 3, question_id: 5, order: 5, createdAt: now, updatedAt: now },
      { id: 6, exam_id: 1, subject_id: 3, question_id: 6, order: 6, createdAt: now, updatedAt: now },
      { id: 7, exam_id: 1, subject_id: 4, question_id: 7, order: 7, createdAt: now, updatedAt: now },
      { id: 8, exam_id: 1, subject_id: 4, question_id: 8, order: 8, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert("ExamAssignments", [
      {
        id: 1,
        exam_id: 1,
        child_id: 1,
        status: "completed",
        assigned_at: new Date("2024-09-01"),
        completed_at: new Date("2024-09-01"),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        exam_id: 1,
        child_id: 2,
        status: "completed",
        assigned_at: new Date("2024-09-02"),
        completed_at: new Date("2024-09-02"),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ExamAnswers", [
      {
        id: 1,
        exam_assignment_id: 1,
        question_id: 1,
        answer_given: "c",
        is_correct: true,
        points_earned: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        exam_assignment_id: 1,
        question_id: 2,
        answer_given: "a",
        is_correct: false,
        points_earned: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        exam_assignment_id: 1,
        question_id: 3,
        answer_given: "b",
        is_correct: true,
        points_earned: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        exam_assignment_id: 1,
        question_id: 4,
        answer_given: "c",
        is_correct: true,
        points_earned: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        exam_assignment_id: 1,
        question_id: 5,
        answer_given: "c",
        is_correct: true,
        points_earned: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        exam_assignment_id: 1,
        question_id: 6,
        answer_given: "a",
        is_correct: false,
        points_earned: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 7,
        exam_assignment_id: 1,
        question_id: 7,
        answer_given: "c",
        is_correct: true,
        points_earned: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 8,
        exam_assignment_id: 1,
        question_id: 8,
        answer_given: "a",
        is_correct: false,
        points_earned: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 9,
        exam_assignment_id: 2,
        question_id: 1,
        answer_given: "c",
        is_correct: true,
        points_earned: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 10,
        exam_assignment_id: 2,
        question_id: 2,
        answer_given: "c",
        is_correct: true,
        points_earned: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 11,
        exam_assignment_id: 2,
        question_id: 3,
        answer_given: "b",
        is_correct: true,
        points_earned: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 12,
        exam_assignment_id: 2,
        question_id: 4,
        answer_given: "a",
        is_correct: false,
        points_earned: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 13,
        exam_assignment_id: 2,
        question_id: 5,
        answer_given: "a",
        is_correct: false,
        points_earned: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 14,
        exam_assignment_id: 2,
        question_id: 6,
        answer_given: "a",
        is_correct: false,
        points_earned: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 15,
        exam_assignment_id: 2,
        question_id: 7,
        answer_given: "c",
        is_correct: true,
        points_earned: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 16,
        exam_assignment_id: 2,
        question_id: 8,
        answer_given: "b",
        is_correct: true,
        points_earned: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ExamResults", [
      {
        id: 1,
        exam_assignment_id: 1,
        child_id: 1,
        subject_id: 1,
        score: 1,
        total_marks: 3,
        percentage: 33.33,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        exam_assignment_id: 1,
        child_id: 1,
        subject_id: 2,
        score: 3,
        total_marks: 3,
        percentage: 100.0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        exam_assignment_id: 1,
        child_id: 1,
        subject_id: 3,
        score: 1,
        total_marks: 3,
        percentage: 33.33,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        exam_assignment_id: 1,
        child_id: 1,
        subject_id: 4,
        score: 1,
        total_marks: 3,
        percentage: 33.33,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        exam_assignment_id: 2,
        child_id: 2,
        subject_id: 1,
        score: 3,
        total_marks: 3,
        percentage: 100.0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        exam_assignment_id: 2,
        child_id: 2,
        subject_id: 2,
        score: 1,
        total_marks: 3,
        percentage: 33.33,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 7,
        exam_assignment_id: 2,
        child_id: 2,
        subject_id: 3,
        score: 0,
        total_marks: 3,
        percentage: 0.0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 8,
        exam_assignment_id: 2,
        child_id: 2,
        subject_id: 4,
        score: 3,
        total_marks: 3,
        percentage: 100.0,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("LearningTrees", [
      {
        id: 1,
        child_id: 1,
        exam_assignment_id: 1,
        child_notes_id: 1,
        status: "active",
        ai_summary:
          "Yousef shows strong communication skills but needs significant support in Math, Social, and Cognitive areas. The learning tree focuses on building foundational skills through structured tasks and visual activities.",
        generated_at: new Date("2024-09-01"),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        child_id: 2,
        exam_assignment_id: 2,
        child_notes_id: 2,
        status: "active",
        ai_summary:
          "Nour excels in Math and Cognitive skills but needs focused support in Communication and critical intervention in Social skills. The learning tree prioritizes social interaction tasks and communication activities.",
        generated_at: new Date("2024-09-02"),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("TreeBranches", [
      {
        id: 1,
        learning_tree_id: 1,
        subject_id: 1,
        score_percentage: 33.33,
        level: "critical",
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        learning_tree_id: 1,
        subject_id: 2,
        score_percentage: 100.0,
        level: "excellent",
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        learning_tree_id: 1,
        subject_id: 3,
        score_percentage: 33.33,
        level: "critical",
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        learning_tree_id: 1,
        subject_id: 4,
        score_percentage: 33.33,
        level: "critical",
        order: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        learning_tree_id: 2,
        subject_id: 1,
        score_percentage: 100.0,
        level: "excellent",
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        learning_tree_id: 2,
        subject_id: 2,
        score_percentage: 33.33,
        level: "critical",
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 7,
        learning_tree_id: 2,
        subject_id: 3,
        score_percentage: 0.0,
        level: "critical",
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 8,
        learning_tree_id: 2,
        subject_id: 4,
        score_percentage: 100.0,
        level: "excellent",
        order: 4,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("TreeTasks", [
      {
        id: 1,
        branch_id: 1,
        title_en: "Count objects around you",
        title_ar: "عد الأشياء من حولك",
        description_en:
          "Count 10 different objects in your home and write down their names and numbers.",
        description_ar: "عد 10 أشياء مختلفة في منزلك واكتب أسماءها وأعدادها.",
        type: "task",
        status: "completed",
        order: 1,
        due_date: null,
        completed_at: new Date("2024-09-05"),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        branch_id: 1,
        title_en: "Number sorting activity",
        title_ar: "نشاط ترتيب الأرقام",
        description_en:
          "Use colored blocks to sort and arrange numbers from 1 to 10 in order.",
        description_ar: "استخدم المكعبات الملونة لترتيب الأرقام من 1 إلى 10 بالترتيب.",
        type: "activity",
        status: "in_progress",
        order: 2,
        due_date: null,
        completed_at: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        branch_id: 1,
        title_en: "Basic addition quiz",
        title_ar: "اختبار الجمع الأساسي",
        description_en:
          "A short quiz to test your understanding of basic addition with numbers up to 10.",
        description_ar:
          "اختبار قصير لاختبار فهمك للجمع الأساسي مع الأرقام حتى 10.",
        type: "quiz",
        status: "locked",
        order: 3,
        due_date: null,
        completed_at: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("TaskDetails", [
      {
        id: 1,
        tree_task_id: 1,
        instructions_en:
          "Walk around your home and count 10 different objects. Write each object name and how many you found. Show the list to your parent when done.",
        instructions_ar:
          "تجول في منزلك وعد 10 أشياء مختلفة. اكتب اسم كل شيء وكم وجدت منه. أظهر القائمة لأحد والديك عند الانتهاء.",
        expected_outcome_en:
          "Child can identify and count at least 10 different objects correctly.",
        expected_outcome_ar:
          "يستطيع الطفل تحديد وعد 10 أشياء مختلفة على الأقل بشكل صحيح.",
        attachment_url: null,
        completed_by_parent: true,
        confirmed_by_teacher: true,
        confirmed_at: new Date("2024-09-05"),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ActivityDetails", [
      {
        id: 1,
        tree_task_id: 2,
        instructions_en:
          "Get 10 colored blocks or any similar objects. Ask your child to arrange them in order from 1 to 10. Help them if needed but encourage independence.",
        instructions_ar:
          "احصل على 10 مكعبات ملونة أو أي أشياء مماثلة. اطلب من طفلك ترتيبها بالترتيب من 1 إلى 10. ساعده إذا لزم الأمر لكن شجع الاستقلالية.",
        materials_needed_en:
          "10 colored blocks or similar objects, a flat surface to arrange them on",
        materials_needed_ar:
          "10 مكعبات ملونة أو أشياء مماثلة، سطح مستوٍ لترتيبها عليه",
        expected_behavior_en:
          "Child should be able to arrange numbers in correct sequence with minimal assistance within 10 minutes.",
        expected_behavior_ar:
          "يجب أن يكون الطفل قادراً على ترتيب الأرقام بالتسلسل الصحيح بمساعدة بسيطة في غضون 10 دقائق.",
        media_url: null,
        done_by_parent: false,
        verified_by_teacher: false,
        teacher_notes_en: null,
        teacher_notes_ar: null,
        verified_at: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("TaskQuizzes", [
      {
        id: 1,
        tree_task_id: 3,
        total_questions: 3,
        passing_score: 60,
        attempts_allowed: 3,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("TaskQuizQuestions", [
      {
        id: 1,
        task_quiz_id: 1,
        question_text_en: "What is 1 + 1?",
        question_text_ar: "ما هو ناتج 1 + 1؟",
        options: JSON.stringify([
          { key: "a", value_en: "1", value_ar: "1" },
          { key: "b", value_en: "2", value_ar: "2" },
          { key: "c", value_en: "3", value_ar: "3" },
          { key: "d", value_en: "4", value_ar: "4" },
        ]),
        correct_answer: "b",
        difficulty: "easy",
        points: 1,
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        task_quiz_id: 1,
        question_text_en: "What is 2 + 3?",
        question_text_ar: "ما هو ناتج 2 + 3؟",
        options: JSON.stringify([
          { key: "a", value_en: "4", value_ar: "4" },
          { key: "b", value_en: "5", value_ar: "5" },
          { key: "c", value_en: "6", value_ar: "6" },
          { key: "d", value_en: "7", value_ar: "7" },
        ]),
        correct_answer: "b",
        difficulty: "easy",
        points: 1,
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        task_quiz_id: 1,
        question_text_en: "What is 5 + 4?",
        question_text_ar: "ما هو ناتج 5 + 4؟",
        options: JSON.stringify([
          { key: "a", value_en: "8", value_ar: "8" },
          { key: "b", value_en: "9", value_ar: "9" },
          { key: "c", value_en: "10", value_ar: "10" },
          { key: "d", value_en: "11", value_ar: "11" },
        ]),
        correct_answer: "b",
        difficulty: "medium",
        points: 1,
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ManualAssignments", [
      {
        id: 1,
        teacher_id: 1,
        child_id: 1,
        title_en: "Draw your family",
        title_ar: "ارسم عائلتك",
        description_en:
          "Draw a picture of your family members and write their names under each person.",
        description_ar: "ارسم صورة لأفراد عائلتك واكتب أسماءهم تحت كل شخص.",
        type: "homework",
        status: "completed",
        attachment_url: null,
        due_date: "2024-09-10",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        teacher_id: 1,
        child_id: 2,
        title_en: "Communication Skills Check",
        title_ar: "فحص مهارات التواصل",
        description_en: "A short quiz to assess current communication skills level.",
        description_ar: "اختبار قصير لتقييم مستوى مهارات التواصل الحالية.",
        type: "quiz",
        status: "pending",
        attachment_url: null,
        due_date: "2024-09-15",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("AssignmentSubmissions", [
      {
        id: 1,
        assignment_id: 1,
        child_id: 1,
        note: "Yousef completed the drawing and was very excited to show his family members.",
        attachment_url: null,
        status: "submitted",
        submitted_at: new Date("2024-09-08"),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("AssignmentFeedbacks", [
      {
        id: 1,
        assignment_id: 1,
        teacher_id: 1,
        feedback_en:
          "Excellent work Yousef! The drawing is detailed and all names are written correctly. Keep up the great effort!",
        feedback_ar:
          "عمل ممتاز يا يوسف! الرسم مفصّل وجميع الأسماء مكتوبة بشكل صحيح. استمر في هذا الجهد الرائع!",
        grade: 95,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ManualQuizzes", [
      {
        id: 1,
        assignment_id: 2,
        total_questions: 2,
        passing_score: 50,
        attempts_allowed: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ManualQuizQuestions", [
      {
        id: 1,
        manual_quiz_id: 1,
        question_bank_id: 3,
        question_text_en: "What do you say when you meet someone for the first time?",
        question_text_ar: "ماذا تقول عندما تقابل شخصاً للمرة الأولى؟",
        options: JSON.stringify([
          { key: "a", value_en: "Goodbye", value_ar: "مع السلامة" },
          { key: "b", value_en: "Hello", value_ar: "مرحباً" },
          { key: "c", value_en: "Thank you", value_ar: "شكراً" },
          { key: "d", value_en: "Sorry", value_ar: "آسف" },
        ]),
        correct_answer: "b",
        difficulty: "easy",
        points: 1,
        order: 1,
        source: "bank",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        manual_quiz_id: 1,
        question_bank_id: null,
        question_text_en: "How do you feel when someone shares their toy with you?",
        question_text_ar: "كيف تشعر عندما يشارك شخص ما لعبته معك؟",
        options: JSON.stringify([
          { key: "a", value_en: "Angry", value_ar: "غاضب" },
          { key: "b", value_en: "Sad", value_ar: "حزين" },
          { key: "c", value_en: "Happy", value_ar: "سعيد" },
          { key: "d", value_en: "Scared", value_ar: "خائف" },
        ]),
        correct_answer: "c",
        difficulty: "easy",
        points: 1,
        order: 2,
        source: "manual",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Messages", [
      {
        id: 1,
        sender_user_id: 4,
        receiver_user_id: 2,
        content:
          "Hello Sara, I wanted to check on Yousef's progress this week. He seems more engaged at home with the activities.",
        is_read: true,
        sent_at: new Date("2024-09-06T09:00:00.000Z"),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        sender_user_id: 2,
        receiver_user_id: 4,
        content:
          "Hello Ahmad! Great to hear that. Yousef has been doing wonderfully with the counting activity. I confirmed his first task today. Please encourage him to continue with the sorting blocks activity next.",
        is_read: false,
        sent_at: new Date("2024-09-06T10:30:00.000Z"),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Notifications", [
      {
        id: 1,
        user_id: 4,
        title_en: "Learning Tree Ready",
        title_ar: "شجرة التعلم جاهزة",
        body_en: "Yousef's personalized learning tree has been generated. Check it out now!",
        body_ar: "تم إنشاء شجرة تعلم يوسف المخصصة. تحقق منها الآن!",
        type: "tree_ready",
        is_read: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        user_id: 4,
        title_en: "Task Confirmed",
        title_ar: "تم تأكيد المهمة",
        body_en: "Sara has confirmed that Yousef completed the counting task. Well done!",
        body_ar: "أكدت سارة أن يوسف أكمل مهمة العد. أحسنت!",
        type: "task_confirmed",
        is_read: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        user_id: 5,
        title_en: "Learning Tree Ready",
        title_ar: "شجرة التعلم جاهزة",
        body_en: "Nour's personalized learning tree has been generated. Check it out now!",
        body_ar: "تم إنشاء شجرة تعلم نور المخصصة. تحقق منها الآن!",
        type: "tree_ready",
        is_read: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        user_id: 2,
        title_en: "New Message",
        title_ar: "رسالة جديدة",
        body_en: "You have a new message from Ahmad Al-Mansour.",
        body_ar: "لديك رسالة جديدة من أحمد المنصور.",
        type: "message",
        is_read: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("ProgressReports", [
      {
        id: 1,
        child_id: 1,
        teacher_id: 1,
        observations_en:
          "Yousef has shown remarkable improvement in communication skills over the past two weeks. He is now initiating greetings independently and maintaining eye contact for longer periods. Math remains a challenge but he is making steady progress with visual learning methods.",
        observations_ar:
          "أظهر يوسف تحسناً ملحوظاً في مهارات التواصل خلال الأسبوعين الماضيين. بات يبادر بالتحية بشكل مستقل ويحافظ على التواصل البصري لفترات أطول. لا تزال الرياضيات تمثل تحدياً لكنه يُحرز تقدماً ثابتاً مع أساليب التعلم المرئي.",
        recommendations_en:
          "Continue visual-based math activities. Introduce simple board games to strengthen social turn-taking skills. Consider adding music-based learning activities as Yousef responds very positively to them.",
        recommendations_ar:
          "الاستمرار في أنشطة الرياضيات المرئية. تقديم ألعاب لوحية بسيطة لتعزيز مهارات التناوب الاجتماعي. النظر في إضافة أنشطة تعلم قائمة على الموسيقى لأن يوسف يستجيب لها بشكل إيجابي جداً.",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Articles", [
      {
        id: 1,
        title_en: "Understanding Autism Spectrum Disorder in Children",
        title_ar: "فهم اضطراب طيف التوحد عند الأطفال",
        content_en:
          "Autism Spectrum Disorder (ASD) is a developmental condition that affects communication, behavior, and social interaction. Early intervention and structured learning environments have been shown to significantly improve outcomes for children with ASD. Parents and teachers play a critical role in supporting development through consistent routines, visual supports, and positive reinforcement strategies.",
        content_ar:
          "اضطراب طيف التوحد هو حالة نمائية تؤثر على التواصل والسلوك والتفاعل الاجتماعي. ثبت أن التدخل المبكر وبيئات التعلم المنظمة تُحسّن بشكل كبير النتائج للأطفال المصابين بالتوحد. يؤدي الآباء والمعلمون دوراً حاسماً في دعم التطور من خلال الروتين المتسق والدعم البصري واستراتيجيات التعزيز الإيجابي.",
        category_en: "Special Needs",
        category_ar: "الاحتياجات الخاصة",
        cover_image_url: null,
        published_at: new Date("2024-08-01"),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        title_en: "How to Support Your Child's Learning at Home",
        title_ar: "كيف تدعم تعلم طفلك في المنزل",
        content_en:
          "Supporting a child with special needs at home requires patience, consistency, and creativity. Establish a predictable daily routine, use visual schedules and picture cards, break tasks into small manageable steps, celebrate every achievement no matter how small, and maintain open communication with your child's teacher through platforms like Rafeeq.",
        content_ar:
          "دعم طفل ذي احتياجات خاصة في المنزل يتطلب الصبر والاتساق والإبداع. أنشئ روتيناً يومياً متوقعاً، واستخدم الجداول المرئية وبطاقات الصور، وقسّم المهام إلى خطوات صغيرة قابلة للإدارة، واحتفل بكل إنجاز مهما كان صغيراً، وحافظ على التواصل المفتوح مع معلم طفلك عبر منصات مثل رفيق.",
        category_en: "Parenting Tips",
        category_ar: "نصائح للوالدين",
        cover_image_url: null,
        published_at: new Date("2024-08-15"),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const tables = [
      "Users",
      "Schools",
      "Teachers",
      "Children",
      "ChildNotes",
      "Subjects",
      "QuestionBanks",
      "Exams",
      "ExamSubjects",
      "ExamQuestions",
      "ExamAssignments",
      "ExamAnswers",
      "ExamResults",
      "LearningTrees",
      "TreeBranches",
      "TreeTasks",
      "TaskDetails",
      "ActivityDetails",
      "TaskQuizzes",
      "TaskQuizQuestions",
      "ManualAssignments",
      "AssignmentSubmissions",
      "AssignmentFeedbacks",
      "ManualQuizzes",
      "ManualQuizQuestions",
      "Messages",
      "Notifications",
      "ProgressReports",
      "Articles",
    ];

    for (const table of tables) {
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), MAX(id)) FROM "${table}";`,
      );
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Articles", null, {});
    await queryInterface.bulkDelete("ProgressReports", null, {});
    await queryInterface.bulkDelete("Notifications", null, {});
    await queryInterface.bulkDelete("Messages", null, {});
    await queryInterface.bulkDelete("ManualQuizQuestions", null, {});
    await queryInterface.bulkDelete("ManualQuizzes", null, {});
    await queryInterface.bulkDelete("AssignmentFeedbacks", null, {});
    await queryInterface.bulkDelete("AssignmentSubmissions", null, {});
    await queryInterface.bulkDelete("ManualAssignments", null, {});
    await queryInterface.bulkDelete("TaskQuizQuestions", null, {});
    await queryInterface.bulkDelete("TaskQuizzes", null, {});
    await queryInterface.bulkDelete("ActivityDetails", null, {});
    await queryInterface.bulkDelete("TaskDetails", null, {});
    await queryInterface.bulkDelete("TreeTasks", null, {});
    await queryInterface.bulkDelete("TreeBranches", null, {});
    await queryInterface.bulkDelete("LearningTrees", null, {});
    await queryInterface.bulkDelete("ExamResults", null, {});
    await queryInterface.bulkDelete("ExamAnswers", null, {});
    await queryInterface.bulkDelete("ExamAssignments", null, {});
    await queryInterface.bulkDelete("ExamQuestions", null, {});
    await queryInterface.bulkDelete("ExamSubjects", null, {});
    await queryInterface.bulkDelete("Exams", null, {});
    await queryInterface.bulkDelete("QuestionBanks", null, {});
    await queryInterface.bulkDelete("Subjects", null, {});
    await queryInterface.bulkDelete("ChildNotes", null, {});
    await queryInterface.bulkDelete("Children", null, {});
    await queryInterface.bulkDelete("Teachers", null, {});
    await queryInterface.bulkDelete("Schools", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
