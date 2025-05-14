

export const verifyEmailPending = () => {

    return (
        <div className="container mx-auto p-8 flex">
            <div className="max-w-md w-full mx-auto">
                <h1>สมัครสำเร็จ!</h1>
                <p>เราได้ส่งลิงก์ยืนยันไปที่ <strong>your@email.com</strong></p>
                <p>กรุณาตรวจสอบอีเมล และคลิกที่ลิงก์เพื่อยืนยันบัญชีของคุณ</p>

                <button >ส่งอีเมลอีกครั้ง</button>

            </div>
        </div>
    );
}

export default verifyEmailPending