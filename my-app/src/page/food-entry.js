import {Button, Input, InputNumber, notification} from "antd";
import {useContext, useEffect, useState} from "react";
import UserContext from "../contexts/user-context";
import FoodService from "../services/food-service";

const FoodEntry = (props) => {
    const {user} = useContext(UserContext)
    const [name, setName] = useState("")
    const [calorie, setCalorie] = useState(10);
    const [dateTime, setDateTime] = useState("");
    const [userId, setUserId] = useState(0);
    const foodId = props?.id;

    useEffect(() => {
        if (props) {
            setName(props.name);
            setCalorie(props.calorie);
            setDateTime(props.dateTime);
            setUserId(props.userId || user.id);
        }
    }, [props, user.id])

    const onSubmit = () => {
        FoodService.addFood({name, calorie, dateTime, userId})
            .then((res) => {
                notification.open({
                    title: 'Success',
                    description: res.data?.message
                })

            })
            .catch(e => {
                notification.open({
                    title: 'Error Occcurred',
                    description: e?.message
                })
            })
    }



    return (
        <>
            <Input addonBefore={'Food Name'} value={name} onChange={e => setName(e.target.value)} />
            <InputNumber addonBefore={'Calories'} value={calorie} onChange={setCalorie} />
            <Input addonBefore={'Date Time (YYYY-MM-DD HH:mm)'} value={dateTime} onChange={e => setDateTime(e.target.value)} />
            <InputNumber disabled={user.isManager} addonBefore={'User Id'} value={userId} onChange={setUserId} />
            <Button type="primary" onClick={onSubmit}>Submit</Button>
        </>
    )
}

export default FoodEntry;