export const exportAsJson = (data:any,fileName?:string) => {
    // Export logic
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
        `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `${fileName}-${new Date().toISOString()}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
};