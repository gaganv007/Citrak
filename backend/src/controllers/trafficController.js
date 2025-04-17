class TrafficController {
    constructor(trafficService) {
        this.trafficService = trafficService;
    }

    async getTrafficData(req, res) {
        try {
            const trafficData = await this.trafficService.fetchTrafficData();
            res.status(200).json(trafficData);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching traffic data', error });
        }
    }

    async updateTrafficData(req, res) {
        try {
            const updatedData = await this.trafficService.updateTrafficData(req.body);
            res.status(200).json(updatedData);
        } catch (error) {
            res.status(500).json({ message: 'Error updating traffic data', error });
        }
    }
}

export default TrafficController;