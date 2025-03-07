import {FaChalkboardTeacher, FaClipboardList, FaMoneyBillWave, FaUsers} from "react-icons/fa";
import {RiAiGenerate} from "react-icons/ri";
import BuyLimitationModal from "../Buy/index.jsx";
import {useState} from "react";
import '../index.css';

const LimitationCard = ({limitations}) => {
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [selectedLimitation, setSelectedLimitation] = useState(null);

    const handleBuyClick = (limitation) => {
        setSelectedLimitation(limitation);
        setIsBuyModalOpen(true);
    };

    return (
        <>
            <div className="list">
                {limitations.map((item) => (
                    <div className="card" key={item.id}>
                        <img src="src/assets/premium.jpg" alt="Gói giới hạn" className="card-image"/>
                        <h3>{item.code} - {item.name}</h3>

                        {item.createClass > 0 && (<p><FaChalkboardTeacher/> Tạo lớp: {item.createClass} lượt</p>)}
                        {item.createExamNormally > 0 && (
                            <p><FaClipboardList/> Tạo đề thi (Thủ công và Nhập từ file): {item.createExamNormally} lượt</p>
                        )}
                        {item.createExamByAI > 0 && (
                            <p><RiAiGenerate/> Tạo đề thi Bằng AI: {item.createExamByAI} lượt</p>
                        )}
                        {item.memberPerClass > 0 && (
                            <p><FaUsers/> Giới hạn thành viên/lớp: +{item.memberPerClass} thành viên</p>
                        )}

                        <div className="price-section">
                            {item.salePercentage > 0 ? (
                                <>
                                    <p className="old-price">
                                        <FaMoneyBillWave/> {item.price.toLocaleString()} VND
                                    </p>
                                    <p className="discounted-price">
                                        <FaMoneyBillWave/> {Math.round(item.price - item.price * (item.salePercentage / 100)).toLocaleString()} VND
                                        <span className="sale-badge"> -{item.salePercentage}%</span>
                                    </p>
                                </>
                            ) : (
                                <p className="final-price">
                                    <FaMoneyBillWave/> {item.price.toLocaleString()} VND
                                </p>
                            )}
                        </div>

                        <button className="buy-button" onClick={() => handleBuyClick(item)}>Mua ngay</button>
                    </div>
                ))}
                {isBuyModalOpen && (
                    <BuyLimitationModal
                        limitation={selectedLimitation}
                        isOpen={isBuyModalOpen}
                        setIsOpen={setIsBuyModalOpen}
                    />
                )}
            </div>
        </>

    );
};

export default LimitationCard;
