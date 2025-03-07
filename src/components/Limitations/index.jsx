import React, {useEffect, useState} from "react";
import {callListLimitation} from "../../services/api.js";
import './index.css'
import {RiVipCrownLine} from "react-icons/ri"
import {Spin, Tabs} from "antd";
import LimitationCard from "./Item/LimitationCard.jsx";

const TabPane = Tabs;

const LimitationList = () => {
    const [limitations, setLimitations] = useState([]);
    const [searchingKeys, setSearchingKeys] = useState("");
    const [startPrice, setStartPrice] = useState("");
    const [endPrice, setEndPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await callListLimitation(0, 10, searchingKeys, startPrice, endPrice, type);
            setLimitations(res?.data?.content || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [type]);

    return (
        <Spin spinning={loading}>
            <div className="container">
                <h2 className="title">
                    <RiVipCrownLine className="title-icon"/> GÓI DỊCH VỤ
                </h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm..."
                        value={searchingKeys}
                        onChange={(e) => setSearchingKeys(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="💰 Giá tối thiểu"
                        value={startPrice}
                        onChange={(e) => setStartPrice(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="💰 Giá tối đa"
                        value={endPrice}
                        onChange={(e) => setEndPrice(e.target.value)}
                    />
                    <button onClick={fetchData}>Lọc</button>
                </div>
                <Tabs
                    defaultActiveKey="2"
                    style={{marginTop: "20px"}}
                    onChange={(key) => setType(key === "4" ? "Combo" : null)}
                >
                    <Tabs.TabPane tab="Lượt sử dụng" key="2">
                        <LimitationCard limitations={limitations}/>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Combo" key="4">
                        <LimitationCard limitations={limitations}/>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Spin>
    );
};

export default LimitationList;