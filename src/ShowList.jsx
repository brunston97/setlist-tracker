import { FormatDate } from './utils/dateExtensions'

const ShowList = ({ showIds, shows }) => {
    return (
        <div className="ml-3 mt-1 mb-2 border-1-2 border-green-400/40 pl-3">
            {showIds.map((showId) => {
                const show = shows[showId];

                if (!show) return null;

                return (
                    <div
                        key={showId}
                        className="py-2 text-sm text-white/80"
                    >
                        <div className="font-medium text-white">
                            {FormatDate(show.date)}
                        </div>

                        <div>
                            {show.venue}
                        </div>

                        <div className="text-white/60">
                            {[
                                show.city,
                                show.state,
                                show.country
                            ]
                                .filter(Boolean)
                                .join(', ')}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ShowList;