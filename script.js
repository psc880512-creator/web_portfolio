// ===================== script.js =====================
// DOM 요소들이 모두 준비된 후에 실행
document.addEventListener("DOMContentLoaded", () => {
    /* *************************************************
     * 1. 상단 헤더 공유 버튼 (#shareBtn)
     ************************************************* */
    const shareBtn = document.getElementById("shareBtn");

    if (shareBtn) {
        shareBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            // 공유할 기본 정보
            const shareData = {
                title: "Soonchan Park’s Portfolio",
                text: "Check out my portfolio.",
                url: window.location.href, // 현재 페이지 주소
            };

            // 1) Web Share API 지원 (모바일, 일부 브라우저)
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error("공유 취소 또는 오류:", err);
                }
            }
            // 2) Web Share API 미지원 → 클립보드에 URL 복사
            else if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("페이지 링크가 클립보드에 복사되었습니다.");
                } catch (err) {
                    alert("복사에 실패했습니다. 직접 주소창에서 복사해 주세요.");
                }
            }
            // 3) 아주 구형 브라우저 대비: 임시 input 생성 후 execCommand 사용
            else {
                const tempInput = document.createElement("input");
                tempInput.value = window.location.href;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
                alert("페이지 링크가 클립보드에 복사되었습니다.");
            }
        });
    }

    /* *************************************************
     * 2. 모바일 메뉴 토글 (햄버거 버튼 .nav-toggle)
     ************************************************* */
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");

    if (toggle && header) {
        toggle.addEventListener("click", () => {
            // .site-header 에 .open 클래스를 토글 → CSS에서 모바일 메뉴 열고 닫기
            header.classList.toggle("open");
        });
    }

    /* *************************************************
     * 3. Steps 섹션 (3단계 탭 전환)
     *    - .steps-tab 버튼 클릭 → 내용/우측 카드 내용 변경
     ************************************************* */
    // 각 단계별로 화면에 보여줄 텍스트/리스트 등을 모아둔 데이터
    const stepsData = {
        1: {
            count: "01",
            title: "Drag and drop your dataset directly from your device",
            description:
                "Zip up your images and upload the dataset to HUB. We automatically validate your labels and prepare everything for training.",
            list: [
                "Support for detection, segmentation, and classification tasks",
                "Automatic dataset checks and quick statistics",
                "No scripts needed — just upload and go",
            ],
            dropLabel: "Upload dataset",
            dropHint: "Example: virus_detection_dataset.zip",
            icon: "⬆",
            mainText: "Drop your .zip file here",
            subText: "or click to browse",
        },
        2: {
            count: "02",
            title: "Select your configurations — and let the AI do the rest",
            description:
                "Choose the task and mode that matches your problem, then fine-tune image size, epochs, and more with a few clicks.",
            list: [
                "Built-in presets for common computer vision tasks",
                "Recommended defaults for beginners",
                "Advanced options for fine-tuning experts",
            ],
            dropLabel: "Choose configuration",
            dropHint: "Example: YOLO detection · 50 epochs",
            icon: "⚙",
            mainText: "Select a model template",
            subText: "and adjust training options",
        },
        3: {
            count: "03",
            title: "Deploy your model to the real world",
            description:
                "Export your trained YOLO model to popular formats and run it on mobile, edge, or cloud infrastructure.",
            list: [
                "Export to ONNX, TensorFlow, CoreML, and more",
                "Test predictions directly in the browser",
                "Integrate with your product using a simple API",
            ],
            dropLabel: "Deployment targets",
            dropHint: "Example: mobile app · edge device · cloud API",
            icon: "🚀",
            mainText: "Pick how you want to deploy",
            subText: "and generate ready-to-use artifacts",
        },
    };

    // Steps 섹션에서 사용하는 DOM 요소들
    const tabButtons = document.querySelectorAll(".steps-tab");
    const countEl = document.querySelector(".steps-count");
    const titleEl = document.querySelector(".steps-title");
    const descEl = document.querySelector(".steps-description");
    const listEl = document.querySelector(".steps-list");

    const dropLabelEl = document.querySelector(".dropzone-label");
    const dropHintEl = document.querySelector(".dropzone-footer");
    const dropIconEl = document.querySelector(".dropzone-icon");
    // 두 번째 <p> 요소 (기본 텍스트 부분)
    const dropMainEl = document.querySelector(".dropzone-area p:nth-child(2)");
    const dropSubEl = document.querySelector(".dropzone-area .dropzone-hint");

    // 특정 단계(step)의 데이터로 화면 내용을 교체하는 함수
    function setStep(step) {
        const data = stepsData[step];
        if (!data) return; // 안전 장치: 잘못된 step 들어오면 무시

        // 숫자 / 제목 / 설명
        if (countEl) countEl.textContent = data.count;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.description;

        // 리스트 항목 비우고 새로 채우기
        if (listEl) {
            listEl.innerHTML = "";
            data.list.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = item;
                listEl.appendChild(li);
            });
        }

        // 오른쪽 드롭존 영역 텍스트 변경
        if (dropLabelEl) dropLabelEl.textContent = data.dropLabel;
        if (dropHintEl) dropHintEl.textContent = data.dropHint;
        if (dropIconEl) dropIconEl.textContent = data.icon;

        // mainText 에 ".zip" 이 포함되어 있으면 <strong> 적용
        if (dropMainEl) {
            if (data.mainText.includes(".zip")) {
                dropMainEl.innerHTML = data.mainText.replace(
                    ".zip",
                    "<strong>.zip</strong>"
                );
            } else {
                dropMainEl.textContent = data.mainText;
            }
        }

        if (dropSubEl) dropSubEl.textContent = data.subText;
    }

    // 탭 버튼 클릭 시, 해당 단계로 전환
    if (tabButtons.length > 0) {
        tabButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const step = btn.dataset.step; // data-step 속성 값(1,2,3)

                // 모든 탭에서 active 제거
                tabButtons.forEach((b) => b.classList.remove("active"));
                // 현재 클릭한 탭에만 active 부여
                btn.classList.add("active");

                // 해당 단계 내용으로 업데이트
                setStep(step);
            });
        });

        // 페이지 첫 진입 시 1단계로 초기화
        setStep(1);
    }

    /* *************************************************
     * 4. 뉴스레터 폼 (메일 입력)
     ************************************************* */
    const newsletterForm = document.querySelector(".newsletter-form");
    const newsletterMessage = document.querySelector(".newsletter-message");

    if (newsletterForm && newsletterMessage) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault(); // 실제 서버 전송 X (데모용)

            const input = newsletterForm.querySelector(".newsletter-input");
            if (!input) return;

            // 값이 비었는지 체크
            if (!input.value.trim()) {
                newsletterMessage.textContent = "Please enter a valid email.";
                return;
            }

            // 성공 메시지 후 입력 초기화
            newsletterMessage.textContent = "Thank you for subscribing!";
            input.value = "";
        });
    }

    /* *************************************************
     * 5. 스크롤 시 섹션 확대/축소 효과 (.scale-section)
     ************************************************* */
    const scaleTargets = document.querySelectorAll(".scale-section");

    if (scaleTargets.length > 0) {
        // IntersectionObserver: 특정 요소가 화면에 얼마나 보이는지 감지
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // 화면에 60% 이상 보이면 is-center 클래스를 추가 → CSS에서 scale(1)
                    if (entry.intersectionRatio > 0.6) {
                        entry.target.classList.add("is-center");
                    } else {
                        // 벗어나면 다시 축소 상태로
                        entry.target.classList.remove("is-center");
                    }
                });
            },
            {
                threshold: [0, 0.3, 0.6, 1], // 관찰 임계값
            }
        );

        // 각 타겟 요소 관찰 시작
        scaleTargets.forEach((el) => observer.observe(el));
    }

    /* *************************************************
     * 6. 포트폴리오 모달 (카드 클릭 시 상세보기)
     ************************************************* */
    const modalOverlay = document.getElementById("portfolioModal");

    if (modalOverlay) {
        // 모달 안의 주요 요소들
        const modalImg = document.getElementById("modalImage");
        const modalTag = document.getElementById("modalTag");
        const modalTitle = document.getElementById("modalTitle");
        const modalDesc = document.getElementById("modalDesc");
        const modalLink = document.getElementById("modalLink");

        // 새로 추가된 4개 메타 정보 요소 (기획의도, 소요시간, 인원, 모델)
        const modalPurpose = document.getElementById("modalPurpose");   // 기획의도
        const modalDuration = document.getElementById("modalDuration"); // 소요시간
        const modalMembers = document.getElementById("modalMembers");   // 인원
        const modalModel = document.getElementById("modalModel");       // 사용한 모델

        // 모달 닫기 버튼(X)
        const closeBtn = modalOverlay.querySelector(".portfolio-modal-close");

        // 포트폴리오 카드(4개)를 모두 가져옴
        const cards = document.querySelectorAll(".audience-card");

        // 각 카드 클릭 시 모달 열기
        cards.forEach((card) => {
            card.addEventListener("click", (e) => {
                e.preventDefault();

                // 카드 안에 있는 요소들 가져오기
                const imgEl = card.querySelector(".audience-card_img img");
                const tagEl = card.querySelector("h4");
                const titleEl = card.querySelector("h3");
                const descEl = card.querySelector("p");

                // 이미지 복사
                if (modalImg) {
                    if (imgEl) {
                        modalImg.src = imgEl.src;
                        modalImg.alt = imgEl.alt || "";
                    } else {
                        modalImg.src = "";
                        modalImg.alt = "";
                    }
                }

                // 텍스트 복사 (태그, 제목, 설명)
                if (modalTag) modalTag.textContent = tagEl ? tagEl.textContent : "";
                if (modalTitle) modalTitle.innerHTML = titleEl ? titleEl.innerHTML : "";
                if (modalDesc) modalDesc.innerHTML = descEl ? descEl.innerHTML : "";

                // 각 카드에 data-* 로 넣어둔 값 읽어서 모달에 표시
                // 예: <article ... data-purpose="..." data-duration="...">
                if (modalPurpose) {
                    modalPurpose.textContent = card.dataset.purpose || "";
                }
                if (modalDuration) {
                    modalDuration.textContent = card.dataset.duration || "";
                }
                if (modalMembers) {
                    modalMembers.textContent = card.dataset.members || "";
                }
                if (modalModel) {
                    modalModel.textContent = card.dataset.model || "";
                }

                // article 의 data-link 값 → 모달의 "링크" 버튼 href 로 사용
                if (modalLink) {
                    const linkUrl = card.dataset.link || "#";
                    modalLink.href = linkUrl;
                }

                // 모달 열기 + 배경 스크롤 잠금
                modalOverlay.classList.add("is-open");
                document.body.style.overflow = "hidden";
            });
        });

        // 공통 모달 닫기 함수
        const closeModal = () => {
            modalOverlay.classList.remove("is-open");
            document.body.style.overflow = "";
        };

        // X 버튼으로 닫기
        if (closeBtn) {
            closeBtn.addEventListener("click", closeModal);
        }

        // 어두운 오버레이(배경)를 클릭 시 닫기
        modalOverlay.addEventListener("click", (e) => {
            // 클릭된 대상이 오버레이 자기 자신일 때만 닫기
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // ESC 키로 닫기
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) {
                closeModal();
            }
        });
    }
});



    /* ===================== PHOTO 섹션 이미지 애니메이션 ===================== */
    const photoItems = document.querySelectorAll(".photo-anim");

    if (photoItems.length > 0) {
        const photoObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // 화면에 들어온 요소에 is-visible 클래스 추가
                        entry.target.classList.add("is-visible");
                        // 한 번 애니메이션 한 뒤에는 관찰 중지
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.3, // 30% 정도 보이면 발동
            }
        );

        photoItems.forEach((el) => photoObserver.observe(el));
    }
