import {Option, SettingsSectionStack} from "../../UI/SettingSectionStack";
import {useTexts} from "../../../utility/TextKeys/TextKeys";
import React from "react";

export function GroupInformation() {

    const text = useTexts(['editGroupInformation', 'groupInformation']);

    const options: Option[] = [
        {
            label: text.editGroupInformation,
            onPress: () => {
            },
            icon: 'edit'
        }
    ];

    return (
        <>
            <SettingsSectionStack title={text.groupInformation} options={options}/>
        </>

    );
}